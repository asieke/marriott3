import type { GoogleCalendarEvent } from '$lib/types/components.types';

export async function GET({ locals: { googleClient, user } }) {
	const selectedCalendars = user?.user_metadata.selectedCalendars;

	const events = await googleClient.getEvents(selectedCalendars[0]);

	return new Response(JSON.stringify(events as GoogleCalendarEvent[]));
}
