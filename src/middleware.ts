import { updateSession } from "@/db/supabase/supabase-middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware(async (auth, req) => {
	const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/user(.*)"]);
	if (isProtectedRoute(req)) await auth.protect();
	
	// Handle first-time visitor cookie
	const response = await updateSession(req);
	const firstVisitCookie = req.cookies.get('first-visit');
	
	if (!firstVisitCookie) {
		// Set cookie for first-time visitor
		const timestamp = new Date().toISOString();
		response.cookies.set('first-visit', timestamp, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365, // 1 year
			path: '/'
		});
	}
	
	return response;
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		// "/(api|trpc)(.*)",
	],
};
