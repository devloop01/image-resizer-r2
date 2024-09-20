import { API_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	return {};
};

/** @type {import('./$types').Actions}*/
export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		formData.delete('compression');

		const { compression } = data;

		try {
			const response = await fetch(`${API_URL}/api/resize/${compression}`, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error('Failed!');
			}

			return { success: true, result };
		} catch (error) {
			return { success: false };
		}
	}
};
