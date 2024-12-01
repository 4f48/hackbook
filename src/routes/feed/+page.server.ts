import { db } from '$lib/server/db';
import { follows, posts, users } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const results = await db
		.select({
			post: posts,
			author: users
		})
		.from(posts)
		.innerJoin(users, eq(posts.author, users.id))
		.innerJoin(follows, eq(follows.followedId, posts.author))
		.where(eq(follows.followerId, locals.uuid))
		.orderBy(desc(posts.date));

	return { results };
};
