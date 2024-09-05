export const calendarColors = [
	'239, 68, 68', // red-500
	'249, 115, 22', // orange-400
	'250, 204, 21', // yellow-300
	'74, 222, 128', // green-400
	'20, 184, 166', // teal-500
	'59, 130, 246', // blue-400
	'99, 102, 241', // indigo-500
	'168, 85, 247', // purple-400
	'236, 72, 153', // pink-500
	'156, 163, 175' // gray-400
];

export function fdate(dateStr: string) {
	// Create a Date object from the parseable date string
	const date = new Date(dateStr);

	return {
		getTime() {
			return date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit'
			});
		},
		getDate() {
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				timeZone: 'UTC'
			});
		},
		getLongDate() {
			return date.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC'
			});
		}
	};
}
