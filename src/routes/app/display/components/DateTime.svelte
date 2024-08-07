<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const getDate = () => {
		const date = new Date();
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	};

	const getTime = () => {
		const date = new Date();
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			second: '2-digit'
		});
	};

	let interval: NodeJS.Timeout;
	let displayDate = getDate();
	let displayTime = getTime();

	onMount(() => {
		displayDate = getDate();
		// Update the time every second
		interval = setInterval(() => {
			displayTime = getTime();
		}, 1000);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

<div class="flex h-full w-full items-center justify-center font-mono font-semibold">
	<div class="text-center">
		<p class="mb-4 text-5xl text-slate-900 dark:text-slate-100">{displayTime}</p>
		<p class="text-xl text-slate-700 dark:text-slate-300">{displayDate}</p>
	</div>
</div>

<style lang="postcss">
	/* Add your styles here */
</style>
