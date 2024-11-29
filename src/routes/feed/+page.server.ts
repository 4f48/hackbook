import { db } from '$lib/server/db';
import { posts, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const results = await db
		.select({
			id: posts.id,
			content: posts.content,
			picture: posts.picture,
			author: users.name,
			authorId: users.id
		})
		.from(posts)
		.leftJoin(users, eq(posts.author, users.id));
	return { results };
};
