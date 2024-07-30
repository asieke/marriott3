import type { Session, User } from '@supabase/supabase-js';
import type { ExtendedSupabaseClient } from '$lib/clients/supabase';
import { GoogleClient } from '$lib/clients/google';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			googleClient: GoogleClient;
			supabase: ExtendedSupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
