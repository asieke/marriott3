import { openai } from '$lib/clients/openai';
import fs from 'fs';

export async function POST({ request }): Promise<Response> {
	try {
		const buffer = await request.arrayBuffer();
		const tempFilePath = `/tmp/audio.webm`;
		fs.writeFileSync(tempFilePath, Buffer.from(buffer));

		// Send the file to OpenAI Whisper API
		const transcription = await openai.audio.transcriptions.create({
			file: fs.createReadStream(tempFilePath),
			model: 'whisper-1'
		});

		// Clean up the temporary file
		fs.unlinkSync(tempFilePath);

		return new Response(JSON.stringify({ text: transcription.text }));
	} catch (error) {
		console.error('Error transcribing audio:', error);
		return new Response(JSON.stringify({ error: 'Couldnt transcribe message' }), { status: 500 });
	}
}
