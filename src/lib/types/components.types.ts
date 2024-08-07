export type DailyWeather = {
	day: string;
	high: number;
	low: number;
	id: number;
	pop: number;
	main: string;
	description: string;
	icon: string;
	sunrise: string;
	sunset: string;
};

export type HourlyWeather = {
	day: string;
	time: string;
	temp: number;
	pop: number;
	humidity: number;
	icon: string;
	shortForecast: string;
	windSpeed: number;
};

export type GoogleCalendarEvent = {
	title: string;
	start: {
		dateTime: string;
		timeZone: string;
	};
	end: {
		dateTime: string;
		timeZone: string;
	};
	color?: number;
	description?: string;
	location?: string;
};
