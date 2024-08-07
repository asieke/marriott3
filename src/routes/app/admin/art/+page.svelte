<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';

	export let data;
	$: ({ session, supabase, events, totalEvents } = data);

	let current = 0;
	let query = '';
	let images: Image[] = [];

	type Image = {
		url: string;
		width: number;
		height: number;
		thumbnail: string;
	};

	onMount(() => {
		console.log(events, totalEvents);
		getImages();
	});

	const getImages = async (query = '') => {
		if (!events || !events[current]) return null;

		const str = events[current].artist + ' ' + events[current].title;

		const url = '/app/api/googleImages?query=' + (query === '' ? str : query);
		console.log(url);
		const { data } = await axios.get(url);
		images = data;
		console.log(images);
	};

	const saveImage = async (url: string) => {
		if (!events || !events[current]) return null;
		images = [];

		console.log('saving image', url);
		const { data: imageData } = await axios.post('/app/api/photos/convert', {
			url: url
		});

		await supabase.from('arts').update({ base64: imageData.base64 }).eq('id', events[current].id);

		current = current + 1;
		await getImages();
	};

	const override = async () => {
		images = [];
		await getImages(query);
		query = '';
	};
</script>

{#if !events || events.length === 0 || events.length - current === 0}
	<div class="flex flex-col space-y-8 p-16 text-2xl">
		<h1 class="mb-8 text-2xl">No more events to process</h1>
	</div>
{:else if events && events[current]}
	<div class="mx-auto my-24 max-w-3xl bg-white p-8">
		<h4>{totalEvents}</h4>
		<h1 class="mb-4 text-2xl">
			[{events[current].id}] {events[current].title || 'Just History?'}
		</h1>
		<p class="text-sm text-slate-600">{events?.[current]?.summary}</p>
		<p class="text-sm text-slate-600">{events?.[current]?.year}</p>

		<div class="mx-auto my-4 flex w-2/3 space-x-2">
			<input
				type="text"
				bind:value={query}
				on:keypress={(e) => e.key === 'Enter' && override()}
				class="w-3/4 border-[1px] border-slate-600 p-2 text-lg"
			/>
			<button on:click={override} class="w-1/4 bg-blue-500 p-3">Override</button>
		</div>

		<div class="my-5 grid grid-cols-6 gap-3">
			{#each images as img}
				<button on:click={() => saveImage(img.url)}>
					{img.width} x {img.height}
					<img src={img.thumbnail} alt="" class="w-full" />
				</button>
			{/each}
		</div>
	</div>
{/if}
