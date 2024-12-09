import { db } from '$lib/server/db';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { comments, posts } from '$lib/server/db/schema';
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
		const post = await db.query.posts.findFirst({
			with: {
				author: {
					columns: {
						avatar: true,
						id: true,
						name: true
					}
				}
			},
			where: eq(posts.id, params.slug)
		});

		const postComments = await db.query.comments.findMany({
			columns: {
				content: true,
				authorId: true,
				date: true
			},
			orderBy: desc(comments.date),
			where: eq(comments.postId, params.slug),
			with: {
				author: {
					columns: {
						avatar: true,
						name: true
					}
				}
			}
		});

		return { post, postComments };
	} catch {
		error(404, 'post not found');
	}
};
