import type { User } from '@supabase/supabase-js';
import type { ExtendedSupabaseClient } from '$lib/clients/supabase';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import axios from 'axios';
import type { OAuth2Client } from 'google-auth-library';

export type GooglePhotoAlbum = {
	id: string;
	title: string;
	productUrl: string;
	mediaItemsCount: string;
	coverPhotoBaseUrl: string;
	coverPhotoMediaItemId: string;
};

type PhotoAlbumData = {
	albums: GooglePhotoAlbum[];
	nextPageToken: string;
};

export class GoogleClient {
	private user: User;
	private supabase: ExtendedSupabaseClient;
	private oauth2Client: OAuth2Client;

	constructor(user: User, supabase: ExtendedSupabaseClient) {
		this.user = user;
		this.supabase = supabase;
		this.oauth2Client = new google.auth.OAuth2();
		this.oauth2Client.setCredentials({
			access_token: user.user_metadata.google_auth_token
		});
	}

	/**************************************
	 * Get a list of Calendars for the user
	 **************************************/
	async getCalendars() {
		await this.refreshToken();
		const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

		try {
			const res = await calendar.calendarList.list();
			return res.data.items?.map((item) => ({
				user_id: this.user.id,
				google_id: item.id,
				timeZone: item.timeZone,
				summary: item.summary,
				description: item.description,
				summaryOverride: item.summaryOverride
			}));
		} catch (error) {
			console.error('Error fetching calendar list:', error);
			return [];
		}
	}

	/**************************************
	 * Get a list of Calendars for the user
	 **************************************/

	async getEvents(google_id: string) {
		await this.refreshToken();
		const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

		try {
			const res = await calendar.events.list({
				calendarId: google_id,
				timeMin: new Date().toISOString(),
				maxResults: 10,
				singleEvents: true,
				orderBy: 'startTime'
			});
			return res.data.items?.map((item) => ({
				title: item.summary,
				start: item.start,
				end: item.end,
				color: parseInt(item.colorId || '0'),
				description: item.description,
				location: item.location
			}));
		} catch (error) {
			console.error('Error fetching calendar list:', error);
			return [];
		}
	}

	/**************************************
	 * Get a list of Photo Albums
	 **************************************/
	async getAlbums(): Promise<GooglePhotoAlbum[]> {
		await this.refreshToken();
		let nextPageToken: string | undefined = undefined;
		const albums: GooglePhotoAlbum[] = [];
		try {
			do {
				const response = await axios.get('https://photoslibrary.googleapis.com/v1/albums', {
					headers: {
						Authorization: `Bearer ${this.oauth2Client.credentials.access_token}`
					},
					params: {
						pageSize: 50,
						pageToken: nextPageToken
					}
				});

				const data = response.data as PhotoAlbumData;

				if (data.albums) {
					albums.push(...data.albums);
				}

				nextPageToken = data.nextPageToken;

				console.log('fetched Google Albums - ', albums.length);
			} while (nextPageToken);

			return albums;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	/**************************************
	 * Get a list of Photo Albums
	 **************************************/
	async getPhotos(albumId: string) {
		await this.refreshToken();
		let nextPageToken: string | undefined = undefined;

		const apiUrl = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';

		const urls = [];

		for (let i = 0; i < 5; i++) {
			const requestBody: object = { albumId, pageSize: 100, pageToken: nextPageToken };
			const headers = {
				Authorization: `Bearer ${this.oauth2Client.credentials.access_token}`,
				'Content-Type': 'application/json'
			};
			try {
				const response = await axios.post(apiUrl, requestBody, { headers });
				const mediaItems = response.data.mediaItems || [];
				console.log(mediaItems.length);
				nextPageToken = response.data.nextPageToken;
				console.log(response.data.nextPageToken);

				urls.push(
					...mediaItems.map((item: { baseUrl: string; mediaMetadata: Record<string, string> }) => ({
						url: item.baseUrl,
						created: item.mediaMetadata.creationTime
					}))
				);

				if (!nextPageToken) break;
			} catch (error) {
				console.log(error);
			}
		}
		return urls as { url: string; created: string }[];
	}

	/**************************************
	 * Helper function to Refresh the Token
	 **************************************/
	async refreshToken() {
		if (new Date() > new Date(this.user.user_metadata.google_token_expiration)) {
			console.log('token - expired');
			const response = await axios.post('https://www.googleapis.com/oauth2/v4/token', null, {
				params: {
					client_id: GOOGLE_CLIENT_ID,
					client_secret: GOOGLE_CLIENT_SECRET,
					refresh_token: this.user.user_metadata.google_refresh_token,
					grant_type: 'refresh_token'
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			const { access_token, expires_in } = response.data;

			await this.supabase.auth.updateUser({
				data: {
					google_auth_token: access_token,
					google_token_expiration: new Date(new Date().getTime() + expires_in * 1000)
				}
			});

			this.oauth2Client.setCredentials({
				access_token
			});
		} else {
			console.log('token - NOT expired');
		}
	}

	sayHello() {
		console.log('Hello from GoogleClient: ', this.user?.id);
	}
}
