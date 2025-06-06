"use server";

import { db } from "@/db/db";
import { restaurants } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createRestaurantSchema, restaurantSchema } from "@/types/schemas";
import type { Restaurant } from "@/types/db";

export type RestaurantFormData = z.infer<typeof createRestaurantSchema>;

/**
 * Creates a new restaurant
 */
export async function createRestaurantAction(formData: RestaurantFormData) {
	try {
		const validatedData = createRestaurantSchema.parse(formData);

		await db.insert(restaurants).values(validatedData);

		revalidatePath("/admin/restaurants");
		redirect("/admin/restaurants");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.flatten().fieldErrors };
		}

		return {
			success: false,
			error: { _form: ["Failed to create restaurant"] },
		};
	}
}

/**
 * Updates an existing restaurant
 */
export async function updateRestaurantAction(
	id: bigint,
	data: Partial<RestaurantFormData>,
) {
	try {
		// Validate partial data
		const validatedData = z
			.object({
				name: z.string().optional(),
				description: z.string().optional(),
				imageUrl: z.string().url().optional(),
				address: z.string().optional(),
			})
			.parse(data);

		await db
			.update(restaurants)
			.set(validatedData)
			.where(eq(restaurants.id, id));

		revalidatePath("/admin/restaurants");

		return {
			success: true,
			message: "Restaurant updated successfully",
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.flatten().fieldErrors };
		}

		return {
			success: false,
			error: { _form: ["Failed to update restaurant"] },
		};
	}
}

/**
 * Deletes a restaurant
 */
export async function deleteRestaurantAction(id: bigint) {
	try {
		await db.delete(restaurants).where(eq(restaurants.id, id));

		revalidatePath("/admin/restaurants");

		return {
			success: true,
			message: "Restaurant deleted successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: { _form: ["Failed to delete restaurant"] },
		};
	}
}

/**
 * Updates the QR code URL for a restaurant
 */
export async function updateRestaurantQRCodeAction(
	id: bigint,
	qrCodeUrl: string,
) {
	try {
		await db
			.update(restaurants)
			.set({ qrCodeUrl })
			.where(eq(restaurants.id, id));

		revalidatePath("/admin/restaurants");

		return {
			success: true,
			message: "QR code updated successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: { _form: ["Failed to update QR code"] },
		};
	}
}

// Action result type
type ActionResult = {
	success: boolean;
	message: string;
	error?: Record<string, string[]>;
};

// Add this new function to handle CSV bulk import
export async function importRestaurantsFromCSV(
	restaurantsData: Record<string, unknown>[],
): Promise<ActionResult> {
	try {
		// Validate the restaurant data with Zod
		const RestaurantSchema = z.object({
			name: z.string().min(1, "Name is required"),
			address: z.string().min(1, "Address is required"),
			description: z.string().optional().nullable(),
			imageUrl: z.string().optional().nullable(),
		});

		// Validate each restaurant
		const validatedData = restaurantsData.map((restaurant) => {
			try {
				return RestaurantSchema.parse(restaurant);
			} catch (error) {
				// If validation fails, throw with details
				if (error instanceof z.ZodError) {
					throw new Error(
						`Invalid restaurant data: ${error.errors.map((e) => e.message).join(", ")}`,
					);
				}
				throw error;
			}
		});

		// Convert validated data to the format expected by Drizzle
		const restaurantsToInsert = validatedData.map((restaurant) => ({
			name: restaurant.name,
			address: restaurant.address,
			description: restaurant.description || "",
			imageUrl: restaurant.imageUrl || "",
		}));

		// Insert all restaurants into the database
		await db.insert(restaurants).values(restaurantsToInsert);

		// Revalidate the restaurants page to show the new data
		revalidatePath("/admin/restaurants");

		return {
			success: true,
			message: `Successfully imported ${validatedData.length} restaurants.`,
		};
	} catch (error) {
		console.error("Error importing restaurants:", error);
		return {
			success: false,
			message: "Failed to import restaurants.",
			error: {
				_form: [(error as Error).message || "Unknown error occurred."],
			},
		};
	}
}
