<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let math = {
		sign: '+',
		numbers: [6, 7, 13],
		hiding: [false, false, false],
		emoji: '😀'
	};

	//create an array of 20 kid friendly emojis, some smilies and some not

	const randomProblem = () => {
		math.hiding = [false, false, false];
		const num1 = Math.floor(Math.random() * 10) + 1;
		const num2 = Math.floor(Math.random() * 10) + 1;
		math.sign = Math.random() > 0.5 ? '+' : '-';

		let num3;
		if (math.sign === '-') {
			num3 = num1 >= num2 ? num1 - num2 : num2 - num1;
			math.numbers = num1 >= num2 ? [num1, num2, num3] : [num2, num1, num3];
		} else {
			num3 = num1 + num2;
			math.numbers = [num1, num2, num3];
		}

		math.hiding[Math.floor(Math.random() * 3)] = true;

		console.log(math);
	};

	let interval: NodeJS.Timeout;

	onMount(async () => {
		// Fetch initial random sentence
		randomProblem();

		// Rotate image every 5 minutes
		interval = setInterval(
			async () => {
				randomProblem();
			},
			5 * 60 * 1000
		);
	});

	onDestroy(() => {
		// Clean up interval on component destroy
		clearInterval(interval);
	});
</script>

<div class="container grid h-full w-full grid-cols-8 gap-1 dark:text-slate-200">
	<div class="col-span-2">
		<div class="num">{math.hiding[0] ? '?' : math.numbers[0]}</div>
	</div>
	<div>{math.sign}</div>
	<div class="col-span-2">
		<div class="num">{math.hiding[1] ? '?' : math.numbers[1]}</div>
	</div>
	<div>=</div>
	<div class="col-span-2">
		<div class="num">{math.hiding[2] ? '?' : math.numbers[2]}</div>
	</div>
</div>

<style lang="postcss">
	.num {
		@apply w-3/4 rounded-xl bg-slate-200 p-4 text-center dark:bg-slate-800;
	}

	.container > div {
		@apply flex items-center justify-center align-middle text-4xl;
	}
</style>
