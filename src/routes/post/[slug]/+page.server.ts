import { db } from '$lib/server/db';
import { desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { comments, likes, posts, users } from '$lib/server/db/schema';
import type { Actions } from '@sveltejs/kit';
import { COOKIE_NAME, verifySession } from '$lib/server/session';

export const actions = {
	default: async ({ cookies, locals, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

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

export const load: PageServerLoad = async ({ cookies, locals, params }) => {
	if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');
	try {
		const result = await db
			.select({
				post: {
					id: posts.id,
					content: posts.content,
					picture: posts.picture,
					date: posts.date
				},
				author: {
					id: users.id,
					name: users.name,
					avatar: users.avatar
				},
				likesCount: sql<number>`COALESCE(count(distinct ${likes.userId}), 0)`.as('likes_count'),
				isLiked:
					sql<boolean>`EXISTS(SELECT 1 FROM ${likes} WHERE ${likes.postId} = ${posts.id} AND ${likes.userId} = ${locals.uuid})`.as(
						'is_liked'
					)
			})
			.from(posts)
			.innerJoin(users, eq(posts.author, users.id))
			.leftJoin(likes, eq(posts.id, likes.postId))
			.where(eq(posts.id, params.slug))
			.groupBy(posts.id, users.id);

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

		const post = result[0];

		return {
			post: {
				...post.post,
				author: post.author,
				likesCount: post.likesCount,
				isLiked: post.isLiked
			},
			comments: postComments,
			currentUser: locals.uuid
		};
	} catch (err) {
		error(404, 'post not found: ' + err);
	}
};
