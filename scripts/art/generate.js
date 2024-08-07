import { data } from './data.js';
import { openai } from '../clients/openai.js';
import { supabase } from '../clients/supabase.js';

export const generateArtJSON = async (object) => {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are a helpful assistant designed to output JSON.
				You will be giving information about a work of art.
        Please return a JSON object with the following properties:
				{
					title: (text) - Title of the Artwork
          artist: (text) - Name of the Artist
          year: (string e.g. '1400 BCE') - Year the Artwork was created, or approximate, ALWAYS INCLUDE BCE OR CE.
          summary: (text, minimum: 125 words, max 150 words) - Written so a 10 year old can understand.
					Provide context about why the art is culturally important and something interesting about the artist.
					facts: (array of strings) - 3 interesting facts about the art or artist. About 1-2 sentences each.  The facts should NOT
					already be part of the summary.
				}
				`
			},
			{
				role: 'user',
				content:
					'Here is the art that you should generate the JSON object about: ' +
					JSON.stringify(object)
			}
		],
		model: 'gpt-4o',
		response_format: { type: 'json_object' }
	});

	return JSON.parse(completion.choices[0].message.content);
};

async function main() {
	const { data: arts } = await supabase
		.from('arts')
		.select('id, title, artist, year')
		.is('facts', null)
		.order('id', { ascending: true });

	console.log('sycning arts... ', arts.length);

	for (let i = 0; i < arts.length; i++) {
		const obj = arts[i];

		// check if the record already exists
		const result = await generateArtJSON(obj);

		const { error } = await supabase
			.from('arts')
			.update({ ...result })
			.eq('id', obj.id);

		if (error) {
			console.log(error);
			console.log(`${i} Error - ${obj.name}`);
		} else {
			console.log(`${i} Success - ${result.title}`);
		}
	}
}

main();
