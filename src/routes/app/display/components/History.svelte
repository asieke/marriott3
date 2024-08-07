<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { db } from '$lib/clients/dexie';
	import type { Tables } from '$lib/types/database.types';

	let data!: {
		title: string;
		subtitle: string;
		text: string;
		facts: string[];
		base64: string;
	};

	let interval: NodeJS.Timeout;

	onMount(async () => {
		// Fetch initial random sentence
		data = await db.getRandomHistory();

		// Rotate image every 5 minutes
		interval = setInterval(
			async () => {
				data = await db.getRandomHistory();
			},
			5 * 60 * 1000
		);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

{#if data}
	<div class="h-full w-full pl-4 text-slate-700 dark:text-slate-100">
		<div class="flex h-[10%] items-center text-3xl font-semibold dark:text-white">
			{data.title}
		</div>
		<div class="h-[65%] w-full overflow-hidden pr-8 text-xl">
			<div
				class="float-right m-6 ml-8 rounded-md shadow-lg"
				style="background-image: url({data.base64}); background-size: cover;
				{data.text.length >= 350 ? 'width: 50%; height: 50%;' : 'width: 66%; height: 66%;'}
				"
			>
				<img
					src={data.base64}
					style="backdrop-filter: blur(10px);"
					alt="Alex"
					class="mx-auto h-full w-full rounded-lg object-contain shadow-lg"
				/>
			</div>
			<p class="py-4 font-semibold dark:text-slate-100">{data.subtitle}</p>
			<p class="overflow-ellipsis pb-3">{data.text}</p>
		</div>
		<div
			class="h-[25%] w-full overflow-clip border-t-[1px] border-slate-300 pt-6 text-xl dark:border-slate-700"
		>
			{#each data.facts.slice(0, 2) as fact}
				<p class="pb-2">{fact}</p>
			{/each}
		</div>

		<!--
		<div class="relative h-full overflow-clip bg-green-500/40 px-6 pb-6 pt-3">
			<p class="mb-3 font-semibold">{art.artist}</p>
			<p class="text-xl">{art.summary}</p>
		</div> -->
	</div>
	<!-- <div class="flex h-full flex-col space-y-3">
		<div class="max-h-[300px] max-w-[300px] flex-grow" style="background-image: url({art.base64});">
			<img
				src={art.base64}
				style="backdrop-filter: blur(10px);"
				alt="Alex"
				class="mx-auto h-full w-full rounded-lg border-[2px] object-contain shadow-lg"
			/>
		</div>

		<div class="w-full text-white">
			<p class="font-display text-xl">{art.title} ({art.year})</p>
			<p class="text-lg font-bold">{art.artist}</p>
			<p class="text-sm">{art.summary}</p>
		</div>
	</div> -->
{/if}

<style>
	/* Add your styles here */
</style>
