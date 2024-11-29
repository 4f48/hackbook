import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { comments, posts, users } from '$lib/server/db/schema';
import type { Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const content = data.get('content');

		if (!content) return { error: 'missing content' };
		if (content.toString().length > 300) return { error: 'content too long' };

		const url = request.url.split('/');

		await db.insert(comments).values({
			authorId: locals.uuid,
			content: content.toString(),
			postId: url[url.length - 1]
		});
	}
} satisfies Actions;
export const load: PageServerLoad = async ({ params }) => {
	try {
		const [post] = await db
			.select({
				content: posts.content,
				picture: posts.picture,
				author: users.name,
				authorId: users.id
			})
			.from(posts)
			.leftJoin(users, eq(posts.author, users.id))
			.where(eq(posts.id, params.slug))
			.limit(1);

		const postComments = await db
			.select({
				content: comments.content,
				author: users.name,
				authorId: comments.authorId
			})
			.from(comments)
			.leftJoin(users, eq(users.id, comments.authorId))
			.where(eq(comments.postId, params.slug));

		return { post, postComments };
	} catch {
		error(404, 'post not found');
	}
};
