import * as jose from 'jose';

export const COOKIE_NAME = 'session';

const { privateKey } = await jose.generateKeyPair('EdDSA', { extractable: true });

export async function createSession(uuid: string): Promise<string> {
	const jwt = await new jose.SignJWT({ uuid })
		.setProtectedHeader({ alg: 'EdDSA' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(privateKey);
	return jwt;
}

export async function verifySession(cookie: string | undefined): Promise<{ uuid: string } | null> {
	if (!cookie) return null;
	try {
		const { payload } = await jose.jwtVerify(cookie, privateKey);
		return payload as { uuid: string };
	} catch {
		return null;
	}
}
