import { db } from '$lib/server/db';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { follows, posts, users } from '$lib/server/db/schema';
import type { Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const url = request.url.split('/');

		const followed = url[url.length - 1];
		const follower = locals.uuid;

		if (followed == follower) return { error: 'users cannot be the same' };

		const [followerExists, followedExists] = await Promise.all([
			db.select().from(users).where(eq(users.id, follower)).execute(),
			db.select().from(users).where(eq(users.id, followed)).execute()
		]);

		if (!followerExists || !followedExists) return { error: 'user does not exist' };

		const followExists = await db.query.follows.findFirst({
			where: and(eq(follows.followerId, follower), eq(follows.followedId, followed))
		});

		if (!followExists) {
			await db.insert(follows).values({
				followerId: follower,
				followedId: followed
			});
		} else {
			await db
				.delete(follows)
				.where(and(eq(follows.followerId, follower), eq(follows.followedId, followed)));
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const you = locals.uuid;
		const user = await db.query.users.findFirst({
			where: eq(users.id, params.slug),
			columns: {
				email: false,
				password: false
			}
		});
		const userPosts = await db
			.select({
				id: posts.id,
				content: posts.content,
				picture: posts.picture,
				date: posts.date
			})
			.from(posts)
			.leftJoin(users, eq(posts.author, users.id))
			.where(eq(posts.author, params.slug))
			.orderBy(desc(posts.date));
		const followExists = await db.query.follows.findFirst({
			where: and(eq(follows.followerId, you), eq(follows.followedId, user!.id))
		});

		return { user, userPosts, you, followers: followExists ? true : false };
	} catch {
		error(404, 'user not found');
	}
};
