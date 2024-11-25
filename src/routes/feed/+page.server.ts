import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await db.query.posts.findMany();
	return { posts };
};
