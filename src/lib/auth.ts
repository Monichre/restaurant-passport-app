/**
 * Helper functions for authentication and authorization
 */

import type { EmailAddress, User } from "@clerk/nextjs/server";
import type { User as DBUser } from "@/types/db";

const ADMIN_AUTH_IDS = [
	"user_2tYiqnTGiP8byuUu4XBmfu6eNZ0",
	"user_2su5eFUSw9IPPmzZAxT6s8VFOnY",
];

/**
 * Check if a user has admin privileges
 */

export function isAdmin(user: User | unknown | DBUser | null): boolean {
	if (!user) return false;

	console.log("🚀 ~ isAdmin ~ user:", user);
	if (ADMIN_AUTH_IDS.includes(user?.id || user?.clerkId)) return true;

	// @ts-ignore
	return (
		user?.primaryEmailAddress?.emailAddress === "liamhellis@gmail.com" ||
		user?.primaryEmailAddress?.emailAddress === "sam@clubhausagency.com" ||
		user?.publicMetadata?.role === "admin"
	);
}

/**
 * Check if a user can access an admin resource
 * This can be extended with more granular permissions as needed
 */
export function canAccessAdminResource(user: string | null): boolean {
	return isAdmin(user);
}

/**
 * Check if a user can edit a specific restaurant
 * This is just an example of how you might implement resource-specific permissions
 */
export function canEditRestaurant(
	user: string | null,
	restaurantId: string,
): boolean {
	// Admin can edit any restaurant
	if (isAdmin(user)) return true;

	// In a real app, you might check if the user is the owner of the restaurant
	// or has been granted specific permissions
	return false;
}
