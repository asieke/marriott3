export interface Photo {
	id: number;
	created: string;
	base64: string;
}

export interface Sentence {
	id: number;
	text: string;
	base64: string;
}

export interface Artist {
	id: number;
	name: string | null;
	description: string | null;
	short_description: string | null;
	category: string | null;
	region: string | null;
	start_year: string | null;
	end_year: string | null;
	base64: string | null;
}

export interface Art {
	id: number;
	artist_id: number;
	title: string;
	category: string | null;
	base64: string;
}

export interface Event {
	id: number;
	title: string;
	date: string;
	summary: string;
	facts: string[];
	questions: string[];
	base64: string;
}
