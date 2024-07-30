import axios from 'axios';
import { GOOGLE_SEARCH_ENGINE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } from '$env/static/private';

const queryGoogleImages = async (text: string) => {
	const search_engine_id = GOOGLE_SEARCH_ENGINE_ID;
	const api_key = GOOGLE_SEARCH_ENGINE_API_KEY;
	const num_results = 6;

	const queryUrl = `https://www.googleapis.com/customsearch/v1?q=${text}&cx=${search_engine_id}&key=${api_key}&searchType=image&num=${num_results}`;

	const { data } = await axios.get(queryUrl);

	const images = data.items
		.filter((item: { link: string }, index: number) => index < 6)
		.map(
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

	return images;
};

export async function GET({ request }) {
	const url = new URL(request.url);
	const text = url.searchParams.get('query') || 'dogs';

	console.log('GETTING GOOGLE IMAGES');
	console.log('text', text);

	const images = await queryGoogleImages(text);

	return new Response(JSON.stringify(images));
}
