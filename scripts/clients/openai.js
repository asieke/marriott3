import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_KEY = process.env.OPENAI_KEY || '';
export const openai = new OpenAI({ apiKey: OPENAI_KEY });

export const generateArtJSON = async (object) => {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are a helpful assistant designed to output JSON.  You will be giving information about a work of art.
        Please return a JSON object with the following properties:
				{
					title: (text) - Title of the Artwork
          artist: (text) - Name of the Artist
          year: (number) - Year the Artwork was created, or approximate
          summary: (text) - a quirky description of the art and artist and why its significant.  It should be <150 words long and suitable for a 10-12 year old.
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
