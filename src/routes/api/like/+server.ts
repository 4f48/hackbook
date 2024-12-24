import type { RequestHandler } from './$types';
import { COOKIE_NAME, verifySession } from '$lib/server/session';
import { db } from '$lib/server/db';
import { likes } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ cookies, request }) => {
	if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

	const data = await request.json().catch(() => {
		return error(500, 'Failed to parse request body!');
	});

	if (!data || !data.postId || !data.userId) return error(400, 'PostId missing from request body');

	const existingLike = await db.query.likes
		.findFirst({
			where: and(eq(likes.postId, data.postId), eq(likes.userId, data.userId))
		})
		.catch(() => {
			console.error('failed to check if like exists');
			return error(500, 'error checking like');
		});

	if (!existingLike) {
		await db
			.insert(likes)
			.values({
				postId: data.postId,
				userId: data.userId
			})
			.catch((error) => {
				console.error('failed to create like');
				return error(500, 'error liking');
			});
	} else {
		await db
			.delete(likes)
			.where(and(eq(likes.postId, data.postId), eq(likes.userId, data.userId)))
			.catch(() => {
				console.error('failed to remove like');
				return error(500, 'error removing like');
			});
	}

	return new Response(null, { status: 200 });
};
