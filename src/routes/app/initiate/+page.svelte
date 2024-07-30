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

	const deleteDB = async () => {
		await db.delete();
		await db.open();
		console.log('database initialized');
	};

	const syncArtists = async () => {
		step = 'Artists';
		synced = 0;
		total = 0;
		console.log('[START] - syncing artists');

		const { data: count } = await supabase.rpc('count_artists');
		total = count;
		await db.artists.clear();

		const chunk = 33;
		const t1 = new Date().getTime();

		for (let i = 0; i < count; i += chunk) {
			const { data } = (await supabase
				.from('artists')
				.select(
					'id, name, description, short_description, category, region, start_year, end_year, base64'
				)
				.order('id')
				.range(i, i + chunk - 1)) as { data: Tables<'artists'>[] };

			if (data) {
				await db.artists.bulkAdd(data);
			}
			synced += Math.min(chunk, count - i);
			console.log('synced ', i + chunk, 'of', count);
		}
		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Artists.  Time Taken: ', t2 - t1);
	};

	const syncArt = async () => {
		step = 'Art';
		synced = 0;
		total = 0;
		console.log('[START] - syncing Art');

		const { data: count } = await supabase.rpc('count_art_popular');
		total = count;
		await db.arts.clear();

		const chunk = 33;
		const t1 = new Date().getTime();

		for (let i = 0; i < count; i += chunk) {
			const { data } = (await supabase
				.from('arts')
				.select('id, artist_id, title, category, base64')
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
				.neq('base64', '')
				.range(i, i + chunk - 1)) as { data: Tables<'events'>[] };

			console.log('data', data);

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
				.neq('base64', '')
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

			synced += chunk.length;
		}

		const t2 = new Date().getTime();
		console.log('[DONE] - Syncing Google Photos.  Time Taken: ', t2 - t1);
	};

	const sync = async () => {
		await syncArtists();
		await syncArt();
		await syncEvents();
		await syncSentences();
		await syncPhotos();
	};
</script>

<Card>
	<h1>Lets set up your Marriott Board!</h1>
	<h3 class="pb-6">
		We need to sync your local files with the database. To do this, we need to select a local folder
		to sync with. This folder will be used to store all of your files and will be synced with the
		database.
	</h3>

	<h2 class="text-center">{step !== '' ? 'Syncing ' : ' '}<b>{step}</b></h2>

	<Progress progress={Math.round((synced * 100) / total)} />

	<div class="mx-auto flex w-1/2 flex-row gap-x-4 pt-6">
		<button on:click={sync}> Sync</button>
		<button on:click={deleteDB}> Delete DB</button>
	</div>
</Card>

<style lang="postcss">
	button {
		@apply w-1/2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700;
	}
</style>
