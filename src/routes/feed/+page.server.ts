import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { COOKIE_NAME, verifySession } from '$lib/server/session';
import { follows, likes, posts, users } from '$lib/server/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');
	/*
	const old = await db
		.select({
			post: posts,
			author: users
		})
		.from(posts)
		.innerJoin(users, eq(posts.author, users.id))
		.innerJoin(follows, eq(follows.followedId, posts.author))
		.where(eq(follows.followerId, locals.uuid))
		.orderBy(desc(posts.date));
	*/

	const postsWithLikes = await db
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
			likesCount: sql<number>`count(distinct ${likes.userId})`.as('likes_count'),
			isLiked: sql<boolean>`COALESCE(bool_or(${likes.userId} = ${locals.uuid}), false)`.as(
				'is_liked'
			)
		})
		.from(posts)
		.innerJoin(users, eq(posts.author, users.id))
		.innerJoin(
			follows,
			and(eq(follows.followerId, locals.uuid), eq(follows.followedId, posts.author))
		)
		.leftJoin(likes, eq(posts.id, likes.postId))
		.groupBy(posts.id, users.id)
		.orderBy(desc(posts.date));

	return {
		posts: postsWithLikes.map(({ post, author, likesCount, isLiked }) => ({
			...post,
			author,
			likesCount,
			isLiked
		}))
	};
};
