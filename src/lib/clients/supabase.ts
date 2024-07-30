import type { SupabaseClient } from '@supabase/supabase-js';

export interface ExtendedSupabaseClient extends SupabaseClient {
	sayHello: () => string;
	user_id: string;
	setUser: (user_id: string) => void;
	setUserData: (key: string, value: string | object) => void;
}

export const getExtendedClient = (supabase: SupabaseClient) => {
	const superClient = supabase as ExtendedSupabaseClient;
	superClient.user_id = '';

	superClient.sayHello = function () {
		return 'Hello there';
	};

	superClient.setUser = function (user_id: string) {
		this.user_id = user_id;
	};

	return superClient;
};
