import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toBigInt(value: string | number) {
	return BigInt(value);
}

export function toNumber(value: string | number) {
	return Number(value);
}

export function convertBigInts<T>(
	obj: T,
	dataType: "number" | "string" = "number",
): T {
	// Handle arrays
	if (Array.isArray(obj)) {
		return obj.map((item) => convertBigInts(item, dataType)) as unknown as T;
	}

	// Handle objects
	if (obj && typeof obj === "object" && !Array.isArray(obj)) {
		return Object.entries(obj).reduce((acc, [key, value]) => {
			acc[key as keyof typeof acc] =
				typeof value === "bigint"
					? dataType === "number"
						? Number(value)
						: value.toString()
					: value instanceof Object
						? convertBigInts(value, dataType)
						: value;
			return acc;
		}, {} as T);
	}

	// Return primitive values as is
	return obj;
}

export function convertBigIntToString<T>(data: T): T {
	if (data === null || data === undefined) {
		return data;
	}

	if (typeof data === "bigint") {
		return String(data) as unknown as T;
	}

	if (Array.isArray(data)) {
		return data.map(convertBigIntToString) as unknown as T;
	}

	if (typeof data === "object") {
		return Object.fromEntries(
			Object.entries(data).map(([key, value]) => [
				key,
				convertBigIntToString(value),
			]),
		) as unknown as T;
	}

	return data;
}

/**
 * Checks if a string is a valid URL
 * @param url - The string to check
 * @returns boolean - Whether the string is a valid URL
 */
export function isValidUrl(url: string | null | undefined): boolean {
	if (!url) return false;
	
	try {
		// Check for common image file extensions for better validation
		const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(url);
		
		// If it has an image extension, try to create a URL object
		if (hasImageExtension) {
			new URL(url);
			return true;
		}
		
		// Otherwise, try to create a URL object and check if it has http/https protocol
		const urlObj = new URL(url);
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
	} catch (e) {
		// If URL constructor throws an error, it's not a valid URL
		// Check if it might be a relative path instead (starting with /)
		if (url.startsWith('/')) {
			return true; // Valid relative URL
		}
		return false;
	}
}
