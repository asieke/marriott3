<script lang="ts">
	import { Card } from '$components';
	import { page } from '$app/stores';
	import { PUBLIC_CALLBACK_URL } from '$env/static/public';

	$: ({ supabase } = $page.data);

	const signIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				scopes:
					'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/photoslibrary.readonly',
				redirectTo: PUBLIC_CALLBACK_URL,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
	};
</script>

<Card>
	<img src="/logo.png" class="mx-auto h-24 w-24" alt="logo" />
	<h1 class="py-6 text-center font-display text-7xl font-extrabold">Sign In</h1>
	<button
		on:click={signIn}
		class="mx-auto my-8 flex items-center rounded-lg border border-gray-300 bg-white p-6 px-10 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
	>
		<img src="/google.png" class="mr-2 h-12 w-12" alt="Google logo" />
		<span class="text-2xl font-light">Continue with Google</span>
	</button>
	<p class="pt-8 text-center text-2xl font-extralight text-slate-600">
		Please connect with Google to sync your photos and calendars and store your dashboard data.
	</p>
</Card>
