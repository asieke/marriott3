import axios from 'axios';
import { GOOGLE_SEARCH_ENGINE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } from '$env/static/private';

const queryGoogleImages = async (text: string) => {
	const search_engine_id = GOOGLE_SEARCH_ENGINE_ID;
	const api_key = GOOGLE_SEARCH_ENGINE_API_KEY;

	const queryUrl = `https://www.googleapis.com/customsearch/v1?q=${text}&cx=${search_engine_id}&key=${api_key}&searchType=image`;

	const { data } = await axios.get(queryUrl);

	const images = data.items.map(
		(item: {
			link: string;
			image: {
				width: number;
				height: number;
				thumbnailLink: string;
			};
		}) => ({
			url: item.link,
			width: item.image.width,
			height: item.image.height,
			thumbnail: item.image.thumbnailLink
		})
	);

	images.sort(
		(a: { url: string }, b: { url: string }) =>
			//sort by whether or not the url contains "wiki"
			(b.url.includes('wiki') ? 1 : 0) - (a.url.includes('wiki') ? 1 : 0)
	);

	return images;
};

export async function GET({ request }) {
	console.log('[GET] - /api/googleImages');

	const url = new URL(request.url);
	const text = url.searchParams.get('query') || 'dogs';

	const images = await queryGoogleImages(text);

	return new Response(JSON.stringify(images));
}
