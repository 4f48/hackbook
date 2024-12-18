import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import argon2 from 'argon2';
import { users } from '$lib/server/db/schema';
import { createSession } from '$lib/server/session';
import { redirect } from '@sveltejs/kit';
import { validateEmail } from '$lib';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email) return { success: false, error: 'form data is missing email' };
		if (!password) {
			return { success: false, error: 'form data is missing password' };
		}

		if (!validateEmail(email.toString())) {
			return { success: false, error: 'invalid email' };
		}

		const user = await db.query.users
			.findFirst({
				where: eq(users.email, email.toString()),
				columns: {
					email: false
				}
			})
			.catch(() => {
				return null;
			});
		if (!user) return { success: false, error: 'wrong email or password' };

		if (!argon2.verify(user.password, password.toString())) {
			return { success: false, error: 'wrong email or password' };
		}

		const session = await createSession(user.id);
		cookies.set('session', session, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7 // 7d
		});
		redirect(303, '/feed');
	}
} satisfies Actions;

export async function load() {
	return new Promise((fulfil) => {
		setTimeout(fulfil, 3000);
	});
}
