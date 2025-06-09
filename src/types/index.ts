/**
 * Re-export all types from the types subdirectory
 */

// Database model types
export * from "./db";

// Zod validation schemas
export * from "./schemas";

// API related types
export * from "./api";

// Auth related types
export type UserRole = "user" | "restaurant_admin" | "system_admin";

export type AuthUser = {
	id: string;
	clerkId: string;
	name: string;
	email: string;
	role: UserRole;
	restaurantIds?: bigint[]; // Only for restaurant_admin
};

// Application state types
export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
	id: string;
	type: ToastType;
	title: string;
	message: string;
	duration?: number;
};

// UI specific types
export type SortDirection = "asc" | "desc";

export type SortOption<T extends string = string> = {
	field: T;
	direction: SortDirection;
};

export type FilterOption<T extends string = string> = {
	field: T;
	value: string | number | boolean | null;
	operator?: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
};

// Theme
export type Theme = "light" | "dark" | "system";

// QR Code
export type QRCodeSize = "sm" | "md" | "lg";

// Feature flags
export type FeatureFlag = {
	name: string;
	enabled: boolean;
	description?: string;
};

// Re-export types from other files
export * from "./db";
// Add other type exports as needed
