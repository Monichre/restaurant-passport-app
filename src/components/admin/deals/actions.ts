"use server";

import { revalidatePath } from "next/cache";
import { createRestaurantDeal } from "@/db/models/restaurants/restaurants";

// Define the form action type
export type FormState = {
	error: string | null;
	success: boolean;
};

// Server action to handle form submission
export async function createDeal(
	prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	try {
		// Extract values from formData
		const title = formData.get("title") as string;
		const content = formData.get("content") as string;
		const restaurantId = formData.get("restaurantId") as string;
		const active = formData.get("active") === "on";

		// Validate form data
		if (!title?.trim()) {
			return { error: "Title is required", success: false };
		}

		if (!content?.trim()) {
			return { error: "Content is required", success: false };
		}

		if (!restaurantId) {
			return { error: "Restaurant selection is required", success: false };
		}

		// Create the deal
		await createRestaurantDeal({
			title,
			content,
			active,
			restaurantId: BigInt(restaurantId),
		});

		// Revalidate the deals page to show the new deal
		revalidatePath("/admin/deals");

		return { error: null, success: true };
	} catch (error) {
		console.error("Error creating deal:", error);
		return {
			error: error instanceof Error ? error.message : "Failed to create deal",
			success: false,
		};
	}
}
