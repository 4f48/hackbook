import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const uuid = locals.uuid;
	return { uuid };
};
