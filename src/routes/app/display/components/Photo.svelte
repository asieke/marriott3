<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { db } from '$lib/clients/dexie';
	import type { Photo } from '$lib/types/dexie.types';

	let photo: Photo | null;
	let interval: NodeJS.Timeout;

	onMount(async () => {
		// Fetch initial random sentence
		photo = await db.getRandomPhoto();

		// Rotate image every 20 seconds
		interval = setInterval(async () => {
			photo = await db.getRandomPhoto();
		}, 60 * 1000);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

{#if photo}
	<div
		class="relative h-full rounded bg-cover shadow-xl"
		style="background-image: url('{photo.base64}');"
	>
		<div
			class="absolute bottom-2 right-2 z-30 flex h-[15%] w-[30%] items-center justify-center rounded bg-black/80 text-base font-semibold text-white"
		>
			{photo.created}
		</div>
		<img
			src={photo.base64}
			style="backdrop-filter: blur(20px);"
			alt="Alex"
			class="mx-auto h-full w-full rounded-lg object-contain shadow-inner"
		/>
	</div>
{/if}

<style>
	/* Add your styles here */
</style>
