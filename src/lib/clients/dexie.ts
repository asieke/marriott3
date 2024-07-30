import Dexie, { type EntityTable } from 'dexie';
import type { Photo, Sentence, Artist, Art, Event } from '$lib/types/dexie.types';

export class MySubClassedDexie extends Dexie {
	photos!: EntityTable<Photo, 'id'>;
	sentences!: EntityTable<Sentence, 'id'>;
	artists!: EntityTable<Artist, 'id'>;
	arts!: EntityTable<Art, 'id'>;
	events!: EntityTable<Event, 'id'>;

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
}

export const db = new MySubClassedDexie();
