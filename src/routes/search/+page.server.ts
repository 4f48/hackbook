import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { COOKIE_NAME, verifySession } from '$lib/server/session';

export const actions = {
	default: async ({ cookies, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

		const data = await request.formData();
		const search = data.get('search');

		redirect(303, `/search?search=${encodeURIComponent(search!.toString())}`);
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ cookies, url }) => {
	if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

	const search = url.searchParams.get('search');
	const results = await db.query.users.findMany({
		where: sql`to_tsvector('english', ${users.name}) @@ websearch_to_tsquery('english', ${search})`,
		columns: {
			password: false,
			email: false
		},
		limit: 20
	});
	return { results, search };
};
