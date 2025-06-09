"use server";

import { eq, count } from "drizzle-orm";
import { db } from "../../db";
import { restaurants, restaurantDeals } from "@/db/drizzle/schema";
import type { Restaurant, RestaurantDetailPayload } from "@/types/db";

export const getRestaurants = async () => {
	// Get all restaurants and only load essential relations
	const restaurantsList = await db.query.restaurants.findMany({
		with: {
			deals: true,
			punchCards: true,
		},
	});

	// Add count metadata to each restaurant
	return restaurantsList.map((restaurant) => ({
		...restaurant,
		punchCardCount: restaurant?.punchCards?.length || 0,
		dealCount: restaurant?.deals?.length || 0,
	}));
};

export type PaginatedRestaurants = {
	restaurants: RestaurantDetailPayload[];
	pagination: {
		total: number;
		pageSize: number;
		currentPage: number;
		totalPages: number;
		hasMore: boolean;
	};
};

export const getPaginatedRestaurants = async (
	page = 1,
	pageSize = 10,
): Promise<PaginatedRestaurants> => {
	// Get paginated restaurants and only load essential relations
	const offset = (page - 1) * pageSize;

	// First get total count for pagination metadata
	const totalCountResult = await db
		.select({ value: count() })
		.from(restaurants);
	const totalCount = totalCountResult[0]?.value || 0;

	// Then get the paginated data
	const restaurantsList = await db.query.restaurants.findMany({
		with: {
			deals: true,
			punchCards: true,
		},
		limit: pageSize,
		offset: offset,
	});

	// Add count metadata to each restaurant
	const restaurantsWithCounts = restaurantsList.map((restaurant) => ({
		...restaurant,
		punchCardCount: restaurant?.punchCards?.length || 0,
		dealCount: restaurant?.deals?.length || 0,
	})) as unknown as RestaurantDetailPayload[];

	// Return both the restaurants and pagination metadata
	return {
		restaurants: restaurantsWithCounts,
		pagination: {
			total: totalCount,
			pageSize,
			currentPage: page,
			totalPages: Math.ceil(totalCount / pageSize),
			hasMore: offset + pageSize < totalCount,
		},
	};
};

// export const getDeals = async () => {
// 	return await db.query.restaurantDeals.findMany({
// 		with: {
// 			restaurant: true,
// 		},
// 	});
// };
// export const getActiveDeals = async () => {
// 	return await db.query.restaurantDeals.findMany({
// 		where: eq(restaurantDeals.active, true),
// 		with: {
// 			restaurant: true,
// 		},
// 	});
// };

export const getRestaurantById = async (id: bigint) => {
	return await db
		.select()
		.from(restaurants)
		.where(eq(restaurants.id, id))
		.limit(1)
		.then((res) => res[0]);
};

export const getRestaurantByIdWithPrizesAndDeals = async (id: bigint) => {
	const restaurant = await db.query.restaurants.findFirst({
		where: eq(restaurants.id, id),
		with: {
			deals: true,
		},
	});

	// Removed console.log for production performance

	if (!restaurant) {
		return null;
	}

	return restaurant;
};

export const getRestaurantByIdWithAll = async (id: bigint) => {
	return await db.query.restaurants.findFirst({
		where: eq(restaurants.id, id),
		with: {
			deals: true,
			punchCards: true,
		},
	});
};

export const createRestaurant = async (data: {
	name: string;
	description: string;
	imageUrl: string;
	address: string;
	qrCodeUrl?: string;
}) => {
	return await db.insert(restaurants).values(data).returning();
};

export const updateRestaurant = async (
	id: bigint,
	data: Partial<{
		name: string;
		description: string;
		imageUrl: string;
		address: string;
		qrCodeUrl: string;
	}>,
) => {
	return await db
		.update(restaurants)
		.set(data)
		.where(eq(restaurants.id, id))
		.returning();
};

export const deleteRestaurant = async (id: bigint) => {
	return await db.delete(restaurants).where(eq(restaurants.id, id)).returning();
};

export const createRestaurantDeal = async (data: {
	restaurantId: bigint;
	title: string;
	content: string;
	active: boolean;
}) => {
	return await db.insert(restaurantDeals).values(data).returning();
};

export const updateRestaurantDeal = async (
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
		.set(data)
		.where(eq(restaurantDeals.id, id))
		.returning();
};

export const deleteRestaurantDeal = async (id: bigint) => {
	return await db
		.delete(restaurantDeals)
		.where(eq(restaurantDeals.id, id))
		.returning();
};
