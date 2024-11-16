import * as jose from 'jose';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export const COOKIE_NAME = 'session';

const JWT_SECRET = env.JWT_SECRET;
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function createSession(uuid: string): Promise<string> {
	const jwt = await new jose.SignJWT({ uuid })
		.setProtectedHeader({ alg: 'EdDSA' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(secretKey);

	const cookie_opts = {
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax' as const,
		path: '/',
		maxAge: 60 * 60 * 24 * 7
	};

	return `${COOKIE_NAME}=${jwt}; ${Object.entries(cookie_opts)
		.map(([key, value]) => `${key}=${value}`)
		.join('; ')}`;
}

export async function verifySession(cookie: string | undefined): Promise<{ uuid: string } | null> {
	if (!cookie) return null;
	try {
		const jwt = cookie.replace(`${COOKIE_NAME}=`, '');
		const { payload } = await jose.jwtVerify(jwt, secretKey);
		return payload as { uuid: string };
	} catch {
		return null;
	}
}
