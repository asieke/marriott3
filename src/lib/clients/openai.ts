import OpenAI from 'openai';
import { OPENAI_KEY } from '$env/static/private';

export const openai = new OpenAI({
	apiKey: OPENAI_KEY
});
