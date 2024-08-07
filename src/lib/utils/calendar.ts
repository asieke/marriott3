export const calendarColors = [
	'#ef4444', // red-500
	'#f97316', // orange-400
	'#facc15', // yellow-300
	'#4ade80', // green-400
	'#14b8a6', // teal-500
	'#3b82f6', // blue-400
	'#6366f1', // indigo-500
	'#a855f7', // purple-400
	'#ec4899', // pink-500
	'#9ca3af' // gray-400
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
