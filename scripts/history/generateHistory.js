import { openai } from '../clients/openai.js';
import { supabase } from '../clients/supabase.js';
import fs from 'fs';

export const generateHistoryJSON = async (line) => {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `
				You are a history blogger that writes a blog for 10-year-olds.
				You will be given a topic and you need to write a 500 WORD BLOG POST ABOUT IT.
				Make the format of the blog as follows:

				Introductory Hook: (1-2 sentences) [Write an engaging hook that draws the reader in and introduces the topic in an exciting way.  Could be a teaser or a question.]

				Historical Context: To understand [Topic]: (1 paragraphs), let's go back to [briefly describe the time period or background needed to understand the topic]. This was a time when [describe a key historical event or situation related to the topic].

				Main Content: [Topic] (5 paragraphs) is fascinating because [describe the main features, events, or importance of the topic]. [Provide interesting facts, stories, and details about the topic that would captivate a 10-year-old's imagination. Include relevant names, places, and dates that are easy to remember and engaging.]

				Conclusion: (1 paragraph) [Summarize the legacy of the topic and explain why it is important to society today. Encourage curiosity and further exploration.]

				Write your blog post in markdown.  Feel free to use headings, bullet points, and other markdown formatting to make your blog post engaging and easy to read.
				`
			},
			{
				role: 'user',
				content: 'Here is the topic: ' + line
			}
		],
		model: 'gpt-4o'
	});

	return completion.choices[0].message.content;
};

async function main() {
	const { data: num } = await supabase.rpc('count_events');

	const chunk = 10;

	for (let i = 0; i < num; i += chunk) {
		const { data } = await supabase
			.from('events')
			.select('id, title, date, summary')
			.eq('long_summary', '')
			.order('id', { ascending: true })
			.limit(chunk);

		for (const row of data) {
			const str = JSON.stringify(row);
			const long_summary = await generateHistoryJSON(str);

			const { error } = await supabase
				.from('events')
				.update({ long_summary: long_summary })
				.eq('id', row.id);

			if (error) {
				console.log(error);
				console.log(`${row.id} Error - ${row.title}`);
			} else {
				console.log(`${row.id} Success - ${row.title}`);
			}
		}
	}
}

main();
