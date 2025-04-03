import { createClient } from "@supabase/supabase-js";

// This version is safe to use in client components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

// Anonymous client for public operations (like realtime subscriptions)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
	realtime: {
		params: {
			eventsPerSecond: 10,
		},
	},
});

// For client-side usage with a token from Clerk
export function createClerkSupabaseClient(
	getToken: () => Promise<string | null>,
) {
	return createClient(supabaseUrl, supabaseAnonKey, {
		global: {
			fetch: async (url, options = {}) => {
				const token = await getToken();

				const headers = new Headers(options?.headers);
				if (token) {
					headers.set("Authorization", `Bearer ${token}`);
				}

				return fetch(url, {
					...options,
					headers,
				});
			},
		},
		realtime: {
			params: {
				eventsPerSecond: 10,
			},
		},
	});
}
