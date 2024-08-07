<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		console.log('Hello');
	});

	onDestroy(() => {
		console.log('Goodbye');
	});
</script>

<div class="absolute z-50 w-[100vw] h-[100vh] bg-black/80">
	<div class="bg-slate-200 w-[60vw] h-[60vh] ml-[20vw] mt-[15vh]">Hello</div>
</div>
