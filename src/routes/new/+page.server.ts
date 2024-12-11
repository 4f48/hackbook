import { validatePicture } from '$lib';
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { COOKIE_NAME, verifySession } from '$lib/server/session';
import { type Actions, error, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies, locals, request }) => {
		if (!(await verifySession(cookies.get(COOKIE_NAME)))) return error(401, 'Not authenticated!');

		const data = await request.formData();
		const content = data.get('content');
		const picture = data.get('picture');

		if (!content) return { error: 'missing content' };
		if (content.toString().length > 1500)
			return { error: 'Contenet is longer than 1500 characters!' };
		if (picture)
			if (!validatePicture(picture.toString())) return { error: 'Picture link is invalid!' };

		try {
			await db.insert(posts).values({
				author: locals.uuid,
				content: content.toString(),
				picture: picture?.toString()
			});
		} catch {
			return { error: 'Failed to create post!' };
		}

		redirect(303, `/user/${locals.uuid}`);
	}
} satisfies Actions;
