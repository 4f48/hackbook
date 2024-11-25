import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const content = data.get('content');
		const picture = data.get('picture');

		if (!content) return { error: 'missing content' };
		if (content.toString().length > 1500) return { error: 'content too long' };
		if (picture) {
			if (!validatePicture(picture.toString())) return { error: 'not a url' };
			if (picture.toString().length > 200) return { error: 'picture url too long' };
		}

		try {
			await db.insert(posts).values({
				author: locals.uuid,
				content: content.toString(),
				picture: picture?.toString()
			});
		} catch {
			return { error: 'something went wrong' };
		}

		redirect(303, '/feed');
	}
} satisfies Actions;

function validatePicture(link: string): boolean {
	try {
		new URL(link);
	} catch {
		return false;
	}

	return true;
}
