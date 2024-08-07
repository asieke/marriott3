/********************************************
/ Converts an image URL to a base64 string
/********************************************/

import axios, { type AxiosError } from 'axios';

const urlToBase64 = async (url: string): Promise<string> => {
	console.log(url);
	try {
		const { data, error } = (await axios.get(url, {
			responseType: 'arraybuffer'
		})) as { data: string; error: AxiosError };
		const buffer = Buffer.from(data, 'binary');
		if (error) throw error;
		return buffer.toString('base64');
	} catch (error) {
		const e = error as AxiosError;
		console.error('Error fetching the URL:', e.message);
		return '';
	}
};

export async function POST({ request }): Promise<Response> {
	console.log('[POST] - /api/photos/convert/');
	const { url } = await request.json();
	const base64 = await urlToBase64(url);

	return new Response(JSON.stringify({ url: url, base64: base64 }));
}
