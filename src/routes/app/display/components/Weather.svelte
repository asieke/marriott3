<script lang="ts">
	import { Umbrella, ArrowUp, ArrowDown } from 'lucide-svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import type { DailyWeather, HourlyWeather } from '$lib/types/components.types';

	let dailyWeather: DailyWeather[];
	let hourlyWeather: HourlyWeather[];
	let minTemp = 0;
	let maxTemp = 100;

	const updateWeather = async () => {
		const { data } = await axios.get('/app/api/weather');
		dailyWeather = data.daily;
		hourlyWeather = data.hourly;
		minTemp = Math.min(...hourlyWeather.map((item) => item.temp)) * 0.95;
		maxTemp = Math.max(...hourlyWeather.map((item) => item.temp)) * 1.05;
		console.log('minTemp', minTemp);
		console.log('maxTemp', maxTemp);
	};

	onMount(async () => {
		await updateWeather();
		setInterval(
			async () => {
				await updateWeather();
				console.log('updated weather', new Date());
			},
			60 * 60 * 1000
		); //update weather every hour
	});
</script>

{#if dailyWeather}
	<div
		class="mb-[5%] grid h-[50%] w-full grid-cols-4 gap-3 py-3 text-slate-700 dark:text-slate-300"
	>
		{#each dailyWeather as item}
			<div class="flex flex-col rounded bg-slate-100 p-2 text-center shadow-lg dark:bg-slate-800">
				<p class="text-lg">{item.day}</p>
				<img
					class="mx-auto h-12 w-12"
					src="https://openweathermap.org/img/wn/{item.icon}@2x.png"
					alt={item.description}
				/>
				<p class="text-lg">
					⛆ {item.pop}%
				</p>
				<p class="text-lg">{item.low} / {item.high}</p>
			</div>
		{/each}
	</div>
{/if}

{#if hourlyWeather && hourlyWeather.length > 0}
	<div class="h-[45%] w-full">
		<div
			class="grid h-[80%] w-full gap-1"
			style="grid-template-columns: repeat(16, minmax(0, 1fr));"
		>
			{#each hourlyWeather as item, i}
				<div class="relative flex h-full w-full flex-col-reverse bg-slate-300 dark:bg-slate-700">
					<div class="bg-blue-500" style="height: {item.pop}%"></div>
					{#if i % 3 === 0}
						<div class="absolute -bottom-8 left-0 text-sm text-white">
							{item.time.split(':')[0]}{item.time.includes('PM') ? 'pm' : 'am'}
						</div>
					{/if}
					<div
						class="absolute flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs text-black"
						style="bottom: {Math.round(((item.temp - minTemp) / (maxTemp - minTemp)) * 100)}%"
					>
						{item.temp}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<!-- {#if dailyWeather}
				{#each dailyWeather as item}
					<div class="flex flex-col items-center justify-center space-y-1 align-middle">
						<div class="font-bold">{item.day}</div>
						<div>
							<img
								class="h-18 w-18"
								src="https://openweathermap.org/img/wn/{item.icon}@2x.png"
								alt={item.description}
							/>
						</div>
						<div class="flex flex-row">
							<ArrowDown class="h-5 w-5 pt-1" />{item.low}
							<ArrowUp class="h-5 w-5 pt-1" />{item.high}
						</div>
						<div class="flex flex-row pt-1">
							<Umbrella class="h-5 w-5 pr-1 pt-[4px]" />{item.pop}%
						</div>
					</div>
				{/each}
			{/if} -->
