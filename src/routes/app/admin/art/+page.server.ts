import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	console.log('page server');

	const { data: count } = await supabase.rpc('count_arts');

	const { data } = await supabase
		.from('arts')
		.select('id, title, artist, year, summary')
		.eq('base64', '')
		.order('id', { ascending: true });

	return {
		totalEvents: count,
		events: data
	};
};
