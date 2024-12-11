import { type Handle, redirect } from '@sveltejs/kit';
import { COOKIE_NAME, verifySession } from '$lib/server/session';

const PROTECTED_ROUTES = ['/settings', '/feed', '/new', '/user/*', '/post/*', '/search'];
const UNAUTHENTICATED_ONLY = ['/', '/signup'];

export const handle: Handle = async ({ event, resolve }) => {
	const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
		if (route.endsWith('*')) return event.url.pathname.startsWith(route.slice(0, -1));
		else return event.url.pathname == route;
	});

	if (isProtectedRoute) {
		const sessionCookie = event.cookies.get(COOKIE_NAME);
		const session = await verifySession(sessionCookie);
		if (!session) redirect(303, '/?unauthenticated');
		else event.locals.uuid = session.uuid;
	} else if (UNAUTHENTICATED_ONLY.includes(event.url.pathname)) {
		const sessionCookie = event.cookies.get(COOKIE_NAME);
		const session = await verifySession(sessionCookie);
		if (session) redirect(303, '/feed');
	}
	return resolve(event);
};
