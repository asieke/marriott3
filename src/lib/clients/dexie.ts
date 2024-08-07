import Dexie, { type EntityTable } from 'dexie';
import type { Photo } from '$lib/types/dexie.types';

import type { Tables } from '$lib/types/database.types';

export class MySubClassedDexie extends Dexie {
	photos!: EntityTable<Photo, 'id'>;
	sentences!: EntityTable<Tables<'sentences'>, 'id'>;
	artists!: EntityTable<Tables<'artists'>, 'id'>;
	arts!: EntityTable<Tables<'arts'>, 'id'>;
	events!: EntityTable<Tables<'events'>, 'id'>;

	constructor() {
		super('LocalDB');
		this.version(1).stores({
			photos: 'id', // primary key "id" (for the runtime!)
			sentences: 'id', // primary key "id" (for the runtime!)
			artists: 'id', // primary key "id" (for the runtime!)
			arts: 'id', // primary key "id" (for the runtime!)
			events: 'id' // primary key "id" (for the runtime!)
		});
	}

	async getRandomPhoto() {
		const record = await this.photos
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.photos.count())))
			.limit(1)
			.first();

		return record
			? {
					...record,
					created: record.created.substring(0, 10),
					base64: 'data:image/png;base64,' + record.base64
				}
			: null;
	}

	async getRandomHistory() {
		const rand = Math.random() < 0.5;

		if (rand) {
			const count = await this.arts.filter((e) => e.base64 !== '').count();
			const randomOffset = Math.floor(Math.random() * count);
			const record = (await this.arts
				.filter((e) => e.base64 !== '')
				.offset(randomOffset)
				.limit(1)
				.first()) as Tables<'arts'>;

			return {
				title: record.title + ' (' + record.year + ')',
				facts: record.facts,
				subtitle: record.artist,
				text: record.summary,
				base64: 'data:image/png;base64,' + record.base64
			};
		} else {
			const count = await this.events.filter((e) => e.base64 !== '').count();
			const randomOffset = Math.floor(Math.random() * count);
			const record = (await this.events
				.filter((e) => e.base64 !== '')
				.offset(randomOffset)
				.limit(1)
				.first()) as Tables<'events'>;

			return {
				title: record.title,
				facts: record.facts,
				subtitle: '',
				text: record.summary,
				base64: 'data:image/png;base64,' + record.base64
			};
		}

		// return { ...artRecord, base64: 'data:image/png;base64,' + artRecord.base64 };
	}

	async getRandomSentence() {
		const count = await this.sentences.filter((e) => e.base64 !== '').count();
		if (count === 0) {
			return null;
		}

		const randomOffset = Math.floor(Math.random() * count);

		const record = await this.sentences
			.filter((e) => e.base64 !== '')
			.offset(randomOffset)
			.limit(1)
			.first();

		if (!record) return null;

		return { ...record, base64: 'data:image/png;base64,' + record.base64 };
	}
}

export const db = new MySubClassedDexie();
