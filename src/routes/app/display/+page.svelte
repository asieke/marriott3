<script lang="ts">
	import { onMount } from 'svelte';
	import { modalShowing } from '$lib/stores';

	import { Calendar, Sentence, Weather, Photo, DateTime, Math, History, Modal } from './components';

	export let data;
	$: ({ supabase } = data);

	onMount(async () => {
		// refresh the page every 45 minutes
		setInterval(
			() => {
				location.reload();
			},
			1000 * 60 * 55
		);

		// add an event listener that listens for the '0' key to be pressed
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '1') {
				// if the '0' key is pressed, reload the page
				modalShowing.set(!$modalShowing);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
	});

	let random = 1;
</script>

{#if $modalShowing}
	<Modal />
{/if}

<div
	class="grid h-[100vh] w-[100vw] grid-cols-4 grid-rows-5 gap-[1vw] bg-slate-800 px-[3vw] pb-[1vh] pt-[5vh]"
	style="background: url('/backgrounds/{random}.jpg') no-repeat center center fixed; background-size: cover;"
>
	<div class="component"><DateTime /></div>
	<div class="component row-span-5"><Calendar /></div>
	<div class="component col-span-2 row-span-4"><History /></div>
	<div class="component row-span-2"><Photo /></div>
	<div class="component row-span-2"><Weather /></div>
	<div class="component"><Math /></div>
	<div class="component"><Sentence /></div>
</div>

<style lang="postcss">
	.component {
		@apply rounded-lg border-[1px] border-slate-300 bg-white p-6 shadow-lg dark:border-slate-500 dark:bg-slate-950;
	}
</style>
