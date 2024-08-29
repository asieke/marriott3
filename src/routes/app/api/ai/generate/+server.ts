import { openai } from '$lib/clients/openai';

export async function POST({ request }) {
	try {
		const messages = await request.json();

		console.log('here are the messages: ', messages);

		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: `
						You are a helpful assistant.
						Please answer the provided question.
						Always keep answers to 3 sentences MAX.`
				},
				{
					role: 'user',
					content: messages.content
				}
			],
			model: 'gpt-4o-mini-2024-07-18'
		});

		console.log(chatCompletion);

		if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
			throw new Error('No choices returned from OpenAI.');
		}

		return new Response(JSON.stringify({ text: chatCompletion.choices[0].message?.content || '' }));
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
	}
}
