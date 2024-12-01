import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const search = data.get('search');

		redirect(303, `/search?search=${encodeURIComponent(search!.toString())}`);
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search');
	const results = await db.query.users.findMany({
		where: sql`to_tsvector('english', ${users.name}) @@ websearch_to_tsquery('english', ${search})`,
		columns: {
			password: false,
			email: false
		},
		limit: 20
	});
	console.debug(results);
	return { results, search };
};
