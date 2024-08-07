import fs from 'fs';
import { openai } from '../clients/openai.js';
import { supabase } from '../clients/supabase.js';

import axios from 'axios';
import sharp from 'sharp';

export const generateAIImage = async (sentence) => {
	try {
		const response = await openai.images.generate({
			model: 'dall-e-3',
			prompt: `Generate an image for a 10 year old child that visually represents the following sentence: ${sentence}. The picture should be clear, easy to understand, and should fill the entire image space without any borders or extraneous details.  DO NOT INCLUDE ANY TEXT ON THE IMAGE.  USE COLOR.`,
			n: 1,
			size: '1024x1024'
		});

		const image_url = response.data[0].url;
		return image_url;
	} catch {
		console.log('Error generating image for: ', sentence);
		return null;
	}
};

/**
 * Resizes an image to 512x512 pixels.
 * @param {string} imageUrl - The URL of the image to be resized.
 * @returns {Promise<Buffer>} - A promise that resolves to the resized image buffer.
 */
export const resizeImage = async (imageUrl) => {
	// Fetch the image data
	const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
	const imageBuffer = Buffer.from(imageResponse.data, 'binary');

	// Resize the image to 512x512
	const resizedImageBuffer = await sharp(imageBuffer).resize(512, 512).toBuffer();

	return resizedImageBuffer;
};

async function main() {
	const data = fs.readFileSync('./scripts/sentences/data.txt', 'utf8');
	const arr = data.split('\n');

	const { data: existingData } = await supabase.from('sentences').select('id');
	const existingIds = existingData.map((d) => d.id);

	for (let i = 0; i < arr.length; i++) {
		const sentence = arr[i].trim();
		//check if the record already exists
		if (existingIds.includes(i)) {
			console.log(`${i} Skipping - ${sentence}`);
			continue;
		}

		const url = await generateAIImage(sentence);

		if (url === null) {
			continue;
		}

		const img = await resizeImage(url);
		const base64 = img.toString('base64');

		const { error } = await supabase.from('sentences').insert({
			id: i,
			text: sentence,
			base64: base64
		});

		if (error) {
			console.log(error);
			console.log(`${i} Error     - ${sentence}`);
		} else {
			console.log(`${i} Inserting - ${sentence}`);
		}
	}
}

main();
