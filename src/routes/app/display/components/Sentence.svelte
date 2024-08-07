<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db } from '$lib/clients/dexie';
	import type { Tables } from '$lib/types/database.types';

	let interval: NodeJS.Timeout;
	let record: Tables<'sentences'> | null = null;

	onMount(async () => {
		// Fetch initial random sentence
		record = await db.getRandomSentence();
		console.log(record);

		// Rotate image every 2 minutes
		interval = setInterval(
			async () => {
				record = await db.getRandomSentence();
			},
			2 * 60 * 1000
		);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

{#if record}
	<div class="flex h-full w-full flex-row">
		<img src={record.base64} alt="" class="h-full rounded-xl shadow-xl" />
		<div class="flex items-center justify-center p-3 pl-5 text-[28px] dark:text-slate-200">
			{record.text}
		</div>
	</div>
{/if}

<style>
	/* Add your styles here */
</style>
