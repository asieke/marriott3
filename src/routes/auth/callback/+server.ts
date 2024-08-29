import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	console.log('-------------------------------');
	console.log('SERVER RE_ROUTE');
	console.log('-------------------------------');

	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;

	const next = url.searchParams.get('next') ?? '/app/display';

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (data && data.session) {
			const { session } = data;
			const google_auth_token = session.provider_token; // Assuming this is the auth token
			const google_refresh_token = session.provider_refresh_token; // Assuming this is the refresh token
			// create an expiration date 1 hour into the future
			const google_token_expiration = new Date(new Date().getTime() + 60 * 60 * 1000);

			console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
			console.log(session);
			console.log('UPDATING THE DATABASE');
			console.log('Google Auth Token: ', google_auth_token);
			console.log('Google Refresh Token: ', google_refresh_token);
			console.log('Google Token Expiration: ', google_token_expiration);
			console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');

			await supabase.auth.updateUser({
				data: google_refresh_token
					? { google_auth_token, google_refresh_token, google_token_expiration }
					: { google_auth_token, google_token_expiration }
			});

			throw redirect(303, `/${next.slice(1)}`);
		}

		console.error('Error exchanging code for session:', error);
	}

	// return the user to an error page with instructions
	throw redirect(303, '/auth/auth-code-error');
};
