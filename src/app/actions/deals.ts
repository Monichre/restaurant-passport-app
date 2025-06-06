"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { restaurantDeals } from "@/db/drizzle/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Action result type
type ActionResult = {
	success: boolean;
	message: string;
	error?: Record<string, string[]>;
};

// Add function to handle CSV bulk import
export async function importDealsFromCSV(
	dealsData: Record<string, unknown>[],
): Promise<ActionResult> {
	try {
		// Validate the deal data with Zod
		const DealSchema = z.object({
			title: z.string().min(1, "Title is required"),
			content: z.string().min(1, "Content is required"),
			restaurantId: z
				.string()
				.or(z.number())
				.transform((val) =>
					typeof val === "string" ? BigInt(val) : BigInt(val),
				),
			active: z.union([
				z.boolean(),
				z
					.string()
					.transform((val) => val.toLowerCase() === "true" || val === "1"),
			]),
			imageUrl: z.string().optional().nullable(),
		});

		// Validate each deal
		const validatedDeals = dealsData.map((deal) => {
			try {
				const validated = DealSchema.parse(deal);
				return {
					title: validated.title,
					content: validated.content,
					restaurantId: validated.restaurantId,
					active: validated.active,
					imageUrl: validated.imageUrl || "",
					// Format dates as ISO strings for drizzle
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
			} catch (error) {
				// If validation fails, throw with details
				if (error instanceof z.ZodError) {
					throw new Error(
						`Invalid deal data: ${error.errors.map((e) => e.message).join(", ")}`,
					);
				}
				throw error;
			}
		});

		// Insert all deals into the database
		await db.insert(restaurantDeals).values(validatedDeals);

		// Revalidate the deals page to show the new data
		revalidatePath("/admin/deals");

		return {
			success: true,
			message: `Successfully imported ${validatedDeals.length} deals.`,
		};
	} catch (error) {
		console.error("Error importing deals:", error);
		return {
			success: false,
			message: "Failed to import deals.",
			error: {
				_form: [(error as Error).message || "Unknown error occurred."],
			},
		};
	}
}

// Define other deal-related actions
export async function updateDealAction(
	id: bigint | number,
	data: Partial<typeof restaurantDeals.$inferInsert>,
): Promise<ActionResult> {
	try {
		await db
			.update(restaurantDeals)
			.set({
				...data,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(restaurantDeals.id, BigInt(id)));

		revalidatePath("/admin/deals");

		return {
			success: true,
			message: "Deal updated successfully!",
		};
	} catch (error) {
		console.error("Error updating deal:", error);
		return {
			success: false,
			message: "Failed to update deal.",
			error: {
				_form: [(error as Error).message || "Unknown error occurred."],
			},
		};
	}
}
