import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import argon2 from 'argon2';
import { users } from '$lib/server/db/schema';
import { createSession } from '$lib/server/session';
import { redirect } from '@sveltejs/kit';

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

function validateEmail(email: string): boolean {
	if (email.length > 254) return false;

	// https://regex101.com/library/sI6yF5
	const regex =
		/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/; // eslint-disable-line no-control-regex
	if (!regex.test(email)) return false;
	return true;
}
