import { createBrowserClient } from "@supabase/ssr";


export const createClient = () =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

export const supabaseBrowserClient = createClient();

// Service client for admin operations (bypasses RLS)
export function createSupabaseServiceClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		}
	);
}

// // For client-side usage with a token from Clerk
// export function createClerkSupabaseClient(
// 	getToken: () => Promise<string | null>,
// ) {
// 	return createClient(supabaseUrl, supabaseAnonKey, {
// 		global: {
// 			fetch: async (url, options = {}) => {
// 				const token = await getToken();

// 				const headers = new Headers(options?.headers);
// 				if (token) {
// 					headers.set("Authorization", `Bearer ${token}`);
// 				}

// 				return fetch(url, {
// 					...options,
// 					headers,
// 				});
// 			},
// 		},
// 		realtime: {
// 			params: {
// 				eventsPerSecond: 10,
// 			},
// 		},
// 	});
// }
