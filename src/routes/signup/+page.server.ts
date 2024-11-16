import type { Actions } from './$types';
import argon2 from 'argon2';
import { db } from '$lib/server/db/index';
import { redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';

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

function validateName(name: string): boolean {
	if (name.length < 3) return false;
	if (name.length > 16) return false;
	return true;
}

function validateEmail(email: string): boolean {
	if (email.length > 254) return false;

	// https://regex101.com/library/sI6yF5
	const regex =
		/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/; // eslint-disable-line no-control-regex
	if (!regex.test(email)) return false;
	return true;
}

function validatePassword(password: string): boolean {
	if (password.length < 8) return false;
	return true;
}
