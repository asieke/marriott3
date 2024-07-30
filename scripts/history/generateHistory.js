import { openai } from '../clients/openai.js';
import { supabase } from '../clients/supabase.js';
import fs from 'fs';

export const generateHistoryJSON = async (line) => {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `
        You are an expert researcher that is creating a series of podcasts about
        important topics across all topics.  The podcast is for 10 years olds to learn about history,
        economics, science, and more.
        You will be given a short line outlining a topic, date, and category.
        From that, please generate the following JSON object
				{
          slug: (text) - 4 or fewer words that describe the topic e.g. "Life of Charles Darwin"
					title: (text) - 12 or fewer words.  The title of the podcast.  It should be quirky and fun for a 10 year old.
          context: (text) - 100-200 words that explain the context prior to the TOPIC.  DONT SUMMARIZE THE TOPIC.  JUST provide the necessary background information to understand a summary of the topic.
          summary: (text) - A 100-200 word summary of the topic that a 10 year old could understand.  Provide any additional context and importantly explain why the topic is historically significant or consequential.
          long_summary: (text) - A 300-500 word summary of the topic that a 10 year old could understand.  Provide any additional context and importantly explain why the topic is historically significant or consequential.
          facts: (array of text) - 3 interesting or quirky facts NOT ALREADY INCLUDED IN THE SUMMARIES.
					questions: (array of text) - 2 interesting discussion questions about the topic for a 10 year old.
					date: (text) - the date of the topic (could be a range or approximate if its long ago)
					image_query: (text) - the text to put into a google search to find an image related to the topic
				}
				`
			},
			{
				role: 'user',
				content: 'Here is the topic: ' + line
			}
		],
		model: 'gpt-4o',
		response_format: { type: 'json_object' }
	});

	return JSON.parse(completion.choices[0].message.content);
};

async function main() {
	const data = fs.readFileSync('./scripts/history/data.txt', 'utf8');
	const dataArr = data.split('\n');

	for (let i = 0; i < 250; i++) {
		//check if the record already exists
		const { data: existingData } = await supabase.from('events').select('id').eq('id', i);
		if (existingData.length > 0) {
			console.log(`${i} Skipping - ${dataArr[i]}`);
			continue;
		}

		const json = await generateHistoryJSON(dataArr[i]);

		const insertData = { ...json, id: i };

		const { error } = await supabase.from('events').insert(insertData);
		if (error) {
			console.log(`${i} Error     - ${dataArr[i]}`);
		} else {
			console.log(`${i} Inserting - ${dataArr[i]}`);
		}
	}
}

main();
