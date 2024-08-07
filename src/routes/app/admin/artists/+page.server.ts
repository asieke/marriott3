import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	console.log('page server');

	const { data: count } = await supabase.rpc('count_artists_total');

	const { data } = await supabase
		.from('artists')
		.select('id, name, description, category, birth, died')
		.eq('base64', '')
		.order('birth', { ascending: false });

	console.log(data);

	return {
		totalArtists: count,
		artists: data
	};
};
