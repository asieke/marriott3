import { OPEN_WEATHER_KEY } from '$env/static/private';
import axios from 'axios';
import type { DailyWeather } from '$lib/types/components.types';

async function getHourlyWeather() {
	const baseURL = 'https://api.weather.gov/points/41.059446,-73.632497';

	try {
		// Get the gridpoints data to find the forecast endpoint
		const gridResponse = await axios.get(`${baseURL}`);
		const hourlyURL = gridResponse.data.properties.forecastHourly;
		const hourlyResponse = (await axios.get(hourlyURL)).data.properties;

		const hourlyData = hourlyResponse.periods
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((item: any) => ({
				day: new Date(item.startTime).toLocaleDateString('en-US', { weekday: 'short' }),
				time: new Date(item.startTime).toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					timeZone: 'America/New_York'
				}),
				temp: item.temperature,
				pop: item.probabilityOfPrecipitation.value,
				humidity: item.relativeHumidity.value,
				icon: item.icon,
				shortForecast: item.shortForecast,
				windSpeed: item.windSpeed
			}))
			.slice(0, 16);

		return hourlyData;
	} catch (error) {
		console.error('Error fetching gridpoints data:', error);
		return [];
	}
}

async function getDailyWeather(): Promise<DailyWeather[]> {
	try {
		const url = `https://api.openweathermap.org/data/2.5/forecast/daily?cnt=4&lat=${41.19807}&lon=${-73.46086}&appid=${OPEN_WEATHER_KEY}&units=imperial`;
		const response = await axios.get(url);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return response.data.list.map((item: any) => ({
			day: new Date(1000 * item.dt).toLocaleDateString('en-US', { weekday: 'short' }),
			high: Math.floor(item.temp.max),
			low: Math.floor(item.temp.min),
			pop: Math.floor(item.pop * 100),
			id: item.weather[0].id,
			main: item.weather[0].main,
			description: item.weather[0].description,
			icon: item.weather[0].icon,
			sunrise: new Date(1000 * item.sunrise)
				.toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					timeZone: 'America/New_York'
				})
				.slice(0, -2),
			sunset: new Date(1000 * item.sunset)
				.toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					timeZone: 'America/New_York'
				})
				.slice(0, -2)
		}));
	} catch (error) {
		console.error('Error fetching weather data:', error);
		return [];
	}
}

export const GET = async () => {
	console.log('GETTING THE WEATHER!');
	const hourly = await getHourlyWeather();
	const daily = await getDailyWeather();
	return new Response(JSON.stringify({ hourly, daily }));
};
