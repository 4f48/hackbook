import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		redirect(303, '/?logged_out');
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	const user = await db.query.users
		.findFirst({
			where: eq(users.id, locals.uuid),
			columns: {
				id: false,
				password: false
			}
		})
		.catch(() => {
			return error(500);
		});

	return {
		user
	};
};
