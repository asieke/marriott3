<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	console.log(data);

	onMount(() => {
		console.log('mounted');
	});
</script>

<div class="mx-auto my-24 max-w-3xl bg-white p-8">
	<h1 class="text-2xl">Hi there</h1>
</div>
