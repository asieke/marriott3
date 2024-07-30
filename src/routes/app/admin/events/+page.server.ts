import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	console.log('page server');

	const { data: count } = await supabase.rpc('count_events_total');

	const { data } = await supabase
		.from('events')
		.select('id, image_query, title, summary')
		.eq('base64', '')
		.order('id', { ascending: true });

	return {
		totalEvents: count,
		events: data
	};
};
