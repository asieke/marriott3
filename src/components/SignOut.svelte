<script lang="ts">
	import { Card } from '$components';
	import { page } from '$app/stores';

	$: ({ supabase } = $page.data);

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error signing out:', error.message);
		} else {
			console.log('Signed out successfully');
			//reload the page
			location.reload();
		}
	};
</script>

<Card>
	<img src="/logo.png" class="mx-auto h-24 w-24" alt="logo" />
	<h1 class="py-6 text-center font-display text-7xl font-extrabold">Sign Out</h1>
	<button
		on:click={signOut}
		class="mx-auto my-8 flex items-center rounded-lg border border-gray-300 bg-white p-6 px-10 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-900 dark:text-white"
	>
		<img src="/logout.png" class="mr-2 h-12 w-12" alt="Sign out icon" />
		<span class="text-2xl font-light">Sign Out</span>
	</button>
	<p class="pt-8 text-center text-2xl font-extralight text-slate-600">
		You can sign out of your account here.
	</p>
</Card>
