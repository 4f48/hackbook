import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { posts, users } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	try {
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
			.orderBy(posts.date);

		return { user, userPosts };
	} catch {
		error(404, 'user not found');
	}
};
