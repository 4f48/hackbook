import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { COOKIE_NAME, verifySession } from '$lib/server/session';
import { follows, posts, users } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');
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
