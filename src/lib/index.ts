export function validateEmail(email: string): boolean {
	if (email.length > 254) return false;

	// https://regex101.com/library/sI6yF5
	const regex =
		/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/; // eslint-disable-line no-control-regex
	if (!regex.test(email)) return false;
	return true;
}

export function validateName(name: string): boolean {
	if (name.length < 3) return false;
	if (name.length > 16) return false;
	return true;
}

export function validatePassword(password: string): boolean {
	if (password.length < 8) return false;
	return true;
}

export function validatePicture(link: string): boolean {
	if (link.length > 2048) return false;
	try {
		new URL(link);
	} catch {
		return false;
	}

	return true;
}
