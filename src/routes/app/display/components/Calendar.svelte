<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { calendarColors, fdate } from '$lib/utils/calendar';
	import type { GoogleCalendarEvent } from '$lib/types/components.types';
	import axios from 'axios';

	let events: { [date: string]: GoogleCalendarEvent[] } = {};
	let interval: NodeJS.Timeout;

	async function fetchEvents() {
		const { data } = await axios.get('/app/api/googleCalendar/getEvents');

		console.log('CALENDAR DATA', data);

		const newEvents: { [date: string]: GoogleCalendarEvent[] } = {};

		for (const event of data) {
			const date = event.start.dateTime.split('T')[0];
			newEvents[date] = newEvents[date] ? [...newEvents[date], event] : [event];
		}

		events = newEvents;
	}

	onMount(() => {
		fetchEvents();
		interval = setInterval(
			() => {
				fetchEvents();
			},
			30 * 60 * 1000
		);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="h-full overflow-hidden text-slate-700 dark:text-slate-300">
	{#each Object.entries(events) as [date, dailyevents]}
		<div>
			<div class="mb-2 text-xl text-slate-400 dark:text-slate-600">{fdate(date).getLongDate()}</div>
			{#each dailyevents as { title, start, end, location, description, color }}
				<div class="mb-2 grid grid-cols-[15px_1fr] rounded pb-2">
					<div
						class="w-full rounded-l-lg py-2"
						style="background-color: {calendarColors[color || 0]}"
					/>
					<div class="w-full rounded-r-lg bg-slate-100 p-2 dark:bg-slate-800">
						<div class="text-xl font-bold">{title}</div>
						{#if description}<div class="text-xl">{description}</div>{/if}
						<div class="text-xl">
							{fdate(start.dateTime).getTime()} - {fdate(end.dateTime).getTime()}
						</div>
						{#if location}<div class="text-sm">{location}</div>{/if}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
