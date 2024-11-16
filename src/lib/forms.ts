import Vine from '@vinejs/vine';

export const login = Vine.object({
	email: Vine.string().email(),
	password: Vine.string()
});

export const signup = Vine.object({
	name: Vine.string(),
	email: Vine.string().email(),
	password: Vine.string()
});
