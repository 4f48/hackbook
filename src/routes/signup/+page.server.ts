import type { Actions } from './$types';
import argon2 from 'argon2';
import { db } from '$lib/server/db/index';
import { redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';
import { validateEmail, validateName, validatePassword } from '$lib';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		const password = data.get('password');

		if (!name) return { success: false, error: 'form data is missing name' };
		if (!email) return { success: false, error: 'form data is missing email' };
		if (!password) {
			return { success: false, error: 'form data is missing password' };
		}

		if (!validateName(name.toString())) {
			return { success: false, error: 'invalid name' };
		}
		if (!validateEmail(email.toString())) {
			return { success: false, error: 'invalid email' };
		}
		if (!validatePassword(password.toString())) {
			return { success: false, error: 'invalid password' };
		}

		const hash = await argon2.hash(password.toString()).catch(() => {
			return null;
		});
		if (!hash) return { success: false, error: 'something went wrong' };

		try {
			await db.insert(users).values({
				name: name.toString(),
				email: email.toString(),
				password: hash
			});
		} catch {
			return { success: false, error: 'something went wrong' };
		}

		redirect(303, '/?post_signup');
	}
} satisfies Actions;

export async function load() {
	return new Promise((fulfil) => {
		setTimeout(fulfil, 3000);
	});
}
