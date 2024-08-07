import { supabase } from '../clients/supabase.js';

async function main() {
	const data = await supabase.from('arts').select('id, title').eq('base64', '');
	console.log(data);

	for (let i = 0; i < data.data.length; i++) {
		const obj = data.data[i];

		//check if the record already exists
		const { data: existingData } = await supabase
			.from('arts_old')
			.select('id, artist_id, base64')
			.ilike('title', obj.title);

		if (existingData.length > 0) {
			console.log(`${i} Exists - ${obj.title}`);
		} else {
			console.log(`${i} Missing - ${obj.title}`);
		}
	}
}

main();
