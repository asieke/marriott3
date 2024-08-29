<script lang="ts">
	import { Card, Progress } from '$components';
	import { page } from '$app/stores';
	import axios from 'axios';
	import type { Tables } from '$lib/types/database.types';
	import { db } from '$lib/clients/dexie';

	$: ({ supabase } = $page.data);

	let step = '';
	let synced = 0;
	let total = 0;
	let doneSyncing = 0;

	const deleteDB = async () => {
		await db.delete();
		await db.open();
		console.log('database initialized');
	};

	const syncArt = async () => {
		step = 'Art';
		synced = 0;
		total = 0;
		console.log('[START] - syncing Art');

		const { data: count } = await supabase.rpc('count_arts');
		total = count;
		await db.arts.clear();

		const chunk = 33;
		const t1 = new Date().getTime();

		for (let i = 0; i < count; i += chunk) {
			const { data } = (await supabase
				.from('arts')
				.select('*')
				.order('id')
				.range(i, i + chunk - 1)) as { data: Tables<'arts'>[] };

			if (data) {
				await db.arts.bulkAdd(data);
			}
			synced += Math.min(chunk, count - i);
			console.log('synced ', i + chunk, 'of', count);
		}
		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Art.  Time Taken: ', t2 - t1);
	};

	const syncEvents = async () => {
		step = 'Historical Events';
		synced = 0;
		total = 0;
		console.log('[START] - syncing Events');

		const { data: count } = await supabase.rpc('count_events');
		total = count;
		await db.events.clear();

		const chunk = 33;
		const t1 = new Date().getTime();

		for (let i = 0; i < count; i += chunk) {
			const { data } = (await supabase
				.from('events')
				.select('id, title, date, summary, facts, questions, base64')
				.order('id')
				.range(i, i + chunk - 1)) as { data: Tables<'events'>[] };

			if (data) {
				await db.events.bulkAdd(data);
			}
			synced += Math.min(chunk, count - i);
			console.log('synced ', i + chunk, 'of', count);
		}
		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Events.  Time Taken: ', t2 - t1);
	};

	const syncSentences = async () => {
		step = 'Reading Sentences';
		synced = 0;
		total = 0;
		console.log('[START] - syncing Sentences');

		const { data: count } = await supabase.rpc('count_sentences');
		total = count;
		console.log(count);
		await db.sentences.clear();

		const chunk = 33;
		const t1 = new Date().getTime();

		for (let i = 0; i < count; i += chunk) {
			const { data } = (await supabase
				.from('sentences')
				.select('id, text, base64')
				.order('id')
				.range(i, i + chunk - 1)) as { data: Tables<'sentences'>[] };

			if (data) {
				await db.sentences.bulkAdd(data);
			}
			synced += Math.min(chunk, count - i);
			console.log('synced ', i + chunk, 'of', count);
		}
		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Sentences.  Time Taken: ', t2 - t1);
	};

	const syncPhotos = async () => {
		const t1 = new Date().getTime();

		step = 'Google Photos';
		synced = 0;
		total = 0;
		console.log('[START] - syncing Google Photos Album');

		// Delete everything from the photos table
		await db.photos.clear();

		const { data: photos } =
			await axios.get<{ created: string; url: string }[]>('/app/api/photos/list');

		const chunkSize = 10;
		total = photos.length;

		for (let i = 0; i < photos.length; i += chunkSize) {
			const chunk = photos.slice(i, i + chunkSize);

			// Process each chunk concurrently
			await Promise.all(
				chunk.map(async (photo, index) => {
					const { data: imageData } = await axios.post('/app/api/photos/convert', {
						url: photo.url
					});

					const photoIndex = i + index;
					await db.photos.add({ id: photoIndex, created: photo.created, base64: imageData.base64 });
				})
			);

			console.log('synced: ', i + chunk.length, 'of', photos.length);

			synced += chunk.length;
		}

		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Google Photos.  Time Taken: ', t2 - t1);
	};

	const sync = async () => {
		await syncArt();
		await syncEvents();
		await syncSentences();
		await syncPhotos();
		doneSyncing = 1;
	};
</script>

<Card>
	{#if doneSyncing === 1}
		<h1>Syncing Complete!</h1>
		<h3 class="pb-6">You are now ready to use the Marriott Board!</h3>
		<div class="mx-auto mt-6 w-1/3">
			<a href="/app/display" class="block w-full text-center">Go to the Board!</a>
		</div>
	{:else}
		<h1>Lets set up your Marriott Board!</h1>
		<h3 class="pb-6">
			We need to sync your local files with the database. To do this, we need to select a local
			folder to sync with. This folder will be used to store all of your files and will be synced
			with the database.
		</h3>

		<h2 class="text-center">{step !== '' ? 'Syncing ' : ' '}<b>{step}</b></h2>

		<Progress progress={Math.round((synced * 100) / total)} />

		<div class="mx-auto flex w-1/2 flex-row gap-x-4 pt-6">
			<button class="w-1/2" on:click={sync}> Sync</button>
			<button class="w-1/2" on:click={deleteDB}> Delete DB</button>
		</div>
	{/if}
</Card>

<style lang="postcss">
	button,
	a {
		@apply rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700;
	}
</style>
