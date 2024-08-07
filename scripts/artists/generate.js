import { supabase } from '../clients/supabase.js';
import { openai } from '../clients/openai.js';

export const generateArtJSON = async (name) => {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are a helpful assistant designed to output JSON.
				You will be given the name of an artist.
				Please return a JSON object with the following properties:
				{
					"name": "string", // The full name of the artist.
					"description": "string", // A brief description of who the artist is and why they are culturally important.
					"category": "string", // The primary category or genre the artist is associated with.
					"birth": "string", // The birth year of the artist
					"died": "string", // The death year of the artist (if applicable)
					"location": "string" // The main location where the artist was active.
				}`
			},
			{
				role: 'user',
				content: 'Here is the artist ' + name
			}
		],
		model: 'gpt-4o',
		response_format: { type: 'json_object' }
	});

	return JSON.parse(completion.choices[0].message.content);
};

async function main() {
	//get the unique artists from the arts table
	const { data } = await supabase.from('arts').select('artist');
	const artists = [...new Set(data.map((d) => d.artist))];

	//get the existing artists
	const { data: existingData } = await supabase.from('artists').select('id');
	const existingIds = existingData.map((d) => d.id);

	for (let i = 0; i < artists.length; i++) {
		const artist = artists[i];

		if (existingIds.includes(i)) {
			console.log(`${i} Skipping - ${artist}`);
			continue;
		}

		const result = await generateArtJSON(artist);

		const { error } = await supabase.from('artists').insert({ id: i, ...result });
		if (error) {
			console.log(error);
			console.log(`${i} Error - ${artist}`);
		} else {
			console.log(`${i} Success - ${artist}`);
		}
	}
}

main();
