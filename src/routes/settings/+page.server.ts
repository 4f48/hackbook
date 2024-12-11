import type { Actions } from './$types';
import { COOKIE_NAME, verifySession } from '$lib/server/session';
import { validateEmail, validateName, validatePassword, validatePicture } from '$lib';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	avatar: async ({ cookies, locals, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

		const data = await request.formData();
		let avatar = data.get('avatar');

		if (avatar) {
			if (!validatePicture(avatar.toString())) return { error: 'Picture link is invalid!' };
		} else {
			avatar = '';
		}

		await db
			.update(users)
			.set({
				avatar: avatar.toString()
			})
			.where(eq(users.id, locals.uuid));
	},
	delete: async ({ cookies, locals }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

		await db.delete(users).where(eq(users.id, locals.uuid));
		cookies.delete(COOKIE_NAME, {
			path: '/'
		});
		redirect(303, '/');
	},
	email: async ({ cookies, locals, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

		const data = await request.formData();
		const email = data.get('email');

		if (!email) return { error: 'Email is required!' };
		if (!validateEmail(email.toString())) return { error: 'Email is invalid!' };

		await db
			.update(users)
			.set({
				email: email.toString()
			})
			.where(eq(users.id, locals.uuid));
	},
	logout: async ({ cookies }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');
		cookies.delete(COOKIE_NAME, { path: '/' });
		redirect(303, '/?logged_out');
	},
	name: async ({ cookies, locals, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

		const data = await request.formData();
		const name = data.get('name');

		if (!name) return { error: 'Name is required!' };
		if (!validateName(name.toString())) return { error: 'Name is invalid!' };

		await db
			.update(users)
			.set({
				name: name.toString()
			})
			.where(eq(users.id, locals.uuid));
	},
	password: async ({ cookies, locals, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

		const data = await request.formData();
		const password = data.get('password');

		if (!password) return { error: 'Password is required!' };
		if (!validatePassword(password.toString())) return { error: 'Password is invalid!' };

		const hash = await argon2.hash(password.toString()).catch(() => {
			return null;
		});
		if (!hash) return { success: false, error: 'Something went wrong' };

		await db
			.update(users)
			.set({
				password: hash
			})
			.where(eq(users.id, locals.uuid));
	}
} satisfies Actions;
