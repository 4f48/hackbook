import { redirect, type Handle } from '@sveltejs/kit';
import { COOKIE_NAME, verifySession } from '$lib/server/session';

const PROTECTED_ROUTES = ['/settings'];

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get(COOKIE_NAME);
	const session = await verifySession(sessionCookie);

	if (PROTECTED_ROUTES.includes(event.url.pathname)) {
		if (!session) redirect(303, '/?unauthenticated');
		event.locals.uuid = session.uuid;
	}

	return resolve(event);
};
