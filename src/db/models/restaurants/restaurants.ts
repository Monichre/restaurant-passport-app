"use server";

import { eq } from "drizzle-orm";
import { db } from "../../db";
import { restaurants, prizes, punchCards } from "../../schema";
import { getPrizesByRestaurantId } from "@/db/models/prizes";

export const getRestaurants = async () => {
	// Get all restaurants with their punchCards relation loaded
	const restaurantsList = await db.select().from(restaurants);

	// For each restaurant, fetch all its punch cards
	const restaurantsWithPunchCards = await Promise.all(
		restaurantsList.map(async (restaurant) => {
			const restaurantPunchCards = await db
				.select()
				.from(punchCards)
				.where(eq(punchCards.restaurantId, restaurant.id));

			return {
				...restaurant,
				punchCards: restaurantPunchCards,
				punchCardCount: restaurantPunchCards.length,
			};
		}),
	);

	return restaurantsWithPunchCards;
};

export const getRestaurantById = async (id: bigint) => {
	return await db
		.select()
		.from(restaurants)
		.where(eq(restaurants.id, id))
		.limit(1)
		.then((res) => res[0]);
};

export const getRestaurantByIdWithPrizes = async (id: bigint) => {
	const restaurant = await db
		.select()
		.from(restaurants)
		.where(eq(restaurants.id, id))
		.limit(1)
		.then((res) => res[0]);
	if (!restaurant) {
		return null;
	}
	const restaurantPrizes: unknown = await getPrizesByRestaurantId(id);

	return {
		...restaurant,
		prizes: restaurantPrizes,
	};
};

export const getRestaurantByIdWithAll = async (id: bigint) => {
	// Get the restaurant
	const restaurant = await db
		.select()
		.from(restaurants)
		.where(eq(restaurants.id, id))
		.limit(1)
		.then((res) => res[0]);

	if (!restaurant) {
		return null;
	}

	// Get the restaurant's prizes
	const restaurantPrizes = await getPrizesByRestaurantId(id);

	// Get the restaurant's punch cards
	const restaurantPunchCards = await db
		.select()
		.from(punchCards)
		.where(eq(punchCards.restaurantId, id));

	// Return the restaurant with associated data
	return {
		...restaurant,
		prizes: restaurantPrizes,
		punchCards: restaurantPunchCards,
		punchCardCount: restaurantPunchCards.length,
	};
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
