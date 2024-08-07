<script lang="ts">
	import { SignIn, SignOut } from '$components';

	export let data;

	console.log(data);
</script>

{#if !data.session}
	<SignIn />
{:else}
	<SignOut />
{/if}
