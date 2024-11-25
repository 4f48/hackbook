import * as jose from 'jose';
import { env } from '$env/dynamic/private';

export const COOKIE_NAME = 'session';

const JWT_SECRET = env.JWT_SECRET;
const secretKey = await jose.importPKCS8(JWT_SECRET, 'EdDSA');

export async function createSession(uuid: string): Promise<string> {
	const jwt = await new jose.SignJWT({ uuid })
		.setProtectedHeader({ alg: 'EdDSA' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(secretKey);
	return jwt;
}

export async function verifySession(cookie: string | undefined): Promise<{ uuid: string } | null> {
	if (!cookie) return null;
	try {
		const { payload } = await jose.jwtVerify(cookie, secretKey);
		return payload as { uuid: string };
	} catch {
		return null;
	}
}
