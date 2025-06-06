"use server";

import { db } from "@/db/db";
import { restaurants } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { createRestaurantSchema } from "@/types/schemas";
import { z } from "zod";
import { createRestaurant } from "@/db/models/restaurants";
import { revalidatePath } from "next/cache";
import { getPaginatedRestaurants, getRestaurantByIdWithAll } from "@/db/models";
import type { Restaurant } from "@/types/db";

// Function to save QR code target URL for a restaurant
export async function saveQRCodeUrl(restaurantId: string, qrCodeUrl: string) {
	try {
		const updatedRestaurant = await db
			.update(restaurants)
			.set({ qrCodeUrl })
			.where(eq(restaurants.id, BigInt(restaurantId)))
			.returning();

		if (!updatedRestaurant || updatedRestaurant.length === 0) {
			console.error("No restaurant updated");
			return {
				success: false,
				error: "No restaurant was updated",
			};
		}
		const enrichedRestaurant = await getRestaurantByIdWithAll(
			BigInt(restaurantId),
		);

		// Use targeted revalidation
		revalidatePath(`/admin/restaurants/${restaurantId}`);

		// Only revalidate the restaurants list, not the entire page
		revalidatePath("/admin/restaurants", "layout");

		return {
			success: true,
			restaurant: enrichedRestaurant,
		};
	} catch (error) {
		console.error("Error saving QR code URL:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to save QR code",
		};
	}
}

export async function saveQrData({
	restaurantId,
	qrCodeUrl,
	qrCodeSvg,
}: {
	restaurantId: string;
	qrCodeUrl: string;
	qrCodeSvg: string;
}) {
	try {
		const updatedRestaurant = await db
			.update(restaurants)
			.set({ qrCodeUrl })
			.where(eq(restaurants.id, BigInt(restaurantId)))
			.returning();

		if (!updatedRestaurant || updatedRestaurant.length === 0) {
			console.error("No restaurant updated");
			return {
				success: false,
				error: "No restaurant was updated",
			};
		}
		const enrichedRestaurant = await getRestaurantByIdWithAll(
			BigInt(restaurantId),
		);

		// Use targeted revalidation
		revalidatePath(`/admin/restaurants/${restaurantId}`);

		// Only revalidate the restaurants list, not the entire page
		revalidatePath("/admin/restaurants", "layout");

		return {
			success: true,
			restaurant: enrichedRestaurant,
		};
	} catch (error) {
		console.error("Error saving QR code URL:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to save QR code",
		};
	}
}

// Function to save multiple QR codes at once for bulk generation
export async function saveBulkQRCodeUrls(
	restaurantQRCodes: { restaurantId: string; qrCodeUrl: string }[],
): Promise<{
	success: boolean;
	results: { restaurantId: string; success: boolean }[];
}> {
	const results: { restaurantId: string; success: boolean }[] = [];

	try {
		// Process each QR code in sequence
		for (const { restaurantId, qrCodeUrl } of restaurantQRCodes) {
			try {
				await db
					.update(restaurants)
					.set({ qrCodeUrl })
					.where(eq(restaurants.id, BigInt(restaurantId)));

				results.push({ restaurantId, success: true });
			} catch (error) {
				console.error(
					`Error saving QR code URL for restaurant ${restaurantId}:`,
					error,
				);
				results.push({ restaurantId, success: false });
			}
		}

		// Only revalidate the restaurants list, not the entire page
		revalidatePath("/admin/restaurants", "layout");

		// Consider the operation successful if at least one QR code was saved
		return {
			success: results.some((result) => result.success),
			results,
		};
	} catch (error) {
		console.error("Error in bulk QR code generation:", error);
		return { success: false, results };
	}
}

// Function to create a new restaurant
export async function createRestaurantAction(
	formData: z.infer<typeof createRestaurantSchema>,
): Promise<{ success: boolean; error?: string }> {
	try {
		// Validate the input data
		const validatedData = createRestaurantSchema.parse(formData);

		// Create the restaurant
		const result = await createRestaurant(validatedData);

		// Revalidate the restaurants page
		revalidatePath("/admin/restaurants");

		return { success: true };
	} catch (error) {
		console.error("Error creating restaurant:", error);
		let errorMessage = "An unexpected error occurred";

		if (error instanceof z.ZodError) {
			errorMessage = error.errors.map((e) => e.message).join(", ");
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		return { success: false, error: errorMessage };
	}
}

/**
 * Fetches paginated restaurant data
 * @param page Current page number (1-based)
 * @param pageSize Number of items per page
 * @returns Array with [restaurants, paginationInfo]
 */
export async function fetchRestaurants(
	page = 1,
	pageSize = 10,
): Promise<[Restaurant[], { total: number }]> {
	const result = await getPaginatedRestaurants(page, pageSize);

	return [result.restaurants, { total: result.pagination.total }];
}
