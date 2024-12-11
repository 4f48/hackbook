import { COOKIE_NAME, verifySession } from '$lib/server/session';
import { db } from '$lib/server/db';
import { follows, posts, users } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { and, desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies, locals, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');
		const url = request.url.split('/');

		const followed = url[url.length - 1];
		const follower = locals.uuid;

		if (followed == follower) return { error: 'Cannot follow yourself!' };

		const [followerExists, followedExists] = await Promise.all([
			db.select().from(users).where(eq(users.id, follower)).execute(),
			db.select().from(users).where(eq(users.id, followed)).execute()
		]);

		if (!followerExists || !followedExists)
			return { error: 'Either one of the users does not exist!' };

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

export const load: PageServerLoad = async ({ cookies, locals, params }) => {
	if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');
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
		error(404, 'User not found!');
	}
};
