import { openai } from '$lib/clients/openai';
import fs from 'fs/promises';
import path from 'path';

const speechFilePath = path.resolve('/tmp/speech.mp3');

export async function POST({ request }) {
	try {
		const { text } = await request.json();

		const mp3 = await openai.audio.speech.create({
			model: 'tts-1',
			voice: 'alloy',
			input: text
		});

		const buffer = Buffer.from(await mp3.arrayBuffer());
		await fs.writeFile(speechFilePath, buffer);

		const fileBuffer = await fs.readFile(speechFilePath);

		return new Response(fileBuffer, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Content-Disposition': 'attachment; filename=speech.mp3'
			}
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
	}
}
