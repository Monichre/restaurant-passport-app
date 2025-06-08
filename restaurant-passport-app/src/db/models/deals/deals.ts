// "use server";

import { eq, desc, and } from "drizzle-orm";
import { db } from "../../db";
import { restaurantDeals, restaurants } from "@/db/drizzle/schema";

// Get all deals
// export const getActiveDeals = async () => {
// 	return await db.query.restaurantDeals.findMany({
// 		where: eq(restaurantDeals.active, true),
// 		with: {
// 			restaurant: true,
// 		},
// 	});
// };
export const getDeals = async () => {
	return await db.query.restaurantDeals.findMany({
		with: {
			restaurant: true,
		},
		orderBy: desc(restaurantDeals.createdAt),
	});
};

// Get active deals only
export const getActiveDeals = async () => {
	return await db.query.restaurantDeals.findMany({
		where: eq(restaurantDeals.active, true),
		with: {
			restaurant: true,
		},
	});
};

// Get a specific deal by ID
export const getDealById = async (id: bigint) => {
	return await db.query.restaurantDeals.findFirst({
		where: eq(restaurantDeals.id, id),
		with: {
			restaurant: true,
		},
	});
};

// Get deals for a specific restaurant
export const getDealsByRestaurantId = async (restaurantId: bigint) => {
	return await db.query.restaurantDeals.findMany({
		where: eq(restaurantDeals.restaurantId, restaurantId),
		orderBy: desc(restaurantDeals.createdAt),
	});
};

// Get active deals for a specific restaurant
export const getActiveDealsByRestaurantId = async (restaurantId: bigint) => {
	return await db.query.restaurantDeals.findMany({
		where: and(
			eq(restaurantDeals.restaurantId, restaurantId),
			eq(restaurantDeals.active, true),
		),
		orderBy: desc(restaurantDeals.createdAt),
	});
};

// Create a new deal
export const createDeal = async (data: {
	restaurantId: bigint;
	title: string;
	content: string;
	active?: boolean;
}) => {
	return await db
		.insert(restaurantDeals)
		.values({
			...data,
			active: data.active ?? true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})
		.returning();
};

// Update an existing deal
export const updateDeal = async (
	id: bigint,
	data: Partial<{
		restaurantId: bigint;
		title: string;
		content: string;
		active: boolean;
	}>,
) => {
	return await db
		.update(restaurantDeals)
		.set({
			...data,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(restaurantDeals.id, id))
		.returning();
};

// Delete a deal
export const deleteDeal = async (id: bigint) => {
	return await db
		.delete(restaurantDeals)
		.where(eq(restaurantDeals.id, id))
		.returning();
};

// Activate or deactivate a deal
export const toggleDealActive = async (id: bigint, active: boolean) => {
	return await db
		.update(restaurantDeals)
		.set({
			active,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(restaurantDeals.id, id))
		.returning();
};

// Bulk create deals (for CSV import)
export const bulkCreateDeals = async (
	deals: {
		restaurantId: bigint;
		title: string;
		content: string;
		active?: boolean;
	}[],
) => {
	const dealsWithTimestamps = deals.map((deal) => ({
		...deal,
		active: deal.active ?? true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}));

	return await db
		.insert(restaurantDeals)
		.values(dealsWithTimestamps)
		.returning();
};

export type Deal = {
	id: bigint;
	restaurantId: bigint;
	title: string;
	content: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
};
