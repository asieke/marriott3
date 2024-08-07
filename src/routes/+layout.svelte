<script>
	import '../styles/app.css';
	import '../styles/fonts';

	import { onMount } from 'svelte';

	onMount(() => {
		//add a keyboard listener to toggle dark mode on 'd' key press
		document.addEventListener('keydown', (e) => {
			if (e.key === 'd') {
				document.documentElement.classList.toggle('dark');
				//set local storage to remember dark mode preference
				localStorage.setItem(
					'theme',
					document.documentElement.classList.contains('dark') ? 'dark' : 'light'
				);
			}
		});
	});
</script>

<div class="h-[100vh] w-[100vw] overflow-hidden bg-slate-100">
	<slot />
</div>
