import { data } from './data.js';
import { generateArtJSON } from '../clients/openai.js';

async function main() {
	for (let i = 0; i < 1; i++) {
		const obj = data[i];
		const result = await generateArtJSON(obj);

		console.log(result);
	}
}

main();
