/********************************************
/ Converts an image URL to a base64 string
/********************************************/

import axios from 'axios';

const urlToBase64 = async (url: string): Promise<string> => {
	try {
		const response = await axios.get(url, {
			responseType: 'arraybuffer'
		});
		const buffer = Buffer.from(response.data, 'binary');
		return buffer.toString('base64');
	} catch (error) {
		console.error('Error fetching the URL:', error);
		throw error;
	}
};

export async function POST({ request }): Promise<Response> {
	const { url } = await request.json();
	const base64 = await urlToBase64(url);

	return new Response(JSON.stringify({ url: url, base64: base64 }));
}
