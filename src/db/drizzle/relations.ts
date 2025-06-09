import { relations } from "drizzle-orm/relations";
import {
	restaurants,
	punchCards,
	users,
	restaurantDeals,
	raffleEntries,
} from "./schema";

export const punchCardsRelations = relations(punchCards, ({ one, many }) => ({
	restaurant: one(restaurants, {
		fields: [punchCards.restaurantId],
		references: [restaurants.id],
	}),
	user: one(users, {
		fields: [punchCards.userId],
		references: [users.id],
	}),
	raffleEntries: many(raffleEntries),
}));

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
	punchCards: many(punchCards),
	deals: many(restaurantDeals),
}));

export const usersRelations = relations(users, ({ many }) => ({
	punchCards: many(punchCards),
	raffleEntries: many(raffleEntries),
}));

export const restaurantDealsRelations = relations(
	restaurantDeals,
	({ one }) => ({
		restaurant: one(restaurants, {
			fields: [restaurantDeals.restaurantId],
			references: [restaurants.id],
		}),
	}),
);

export const raffleEntriesRelations = relations(raffleEntries, ({ one }) => ({
	punchCard: one(punchCards, {
		fields: [raffleEntries.punchCardId],
		references: [punchCards.id],
	}),
	user: one(users, {
		fields: [raffleEntries.userId],
		references: [users.id],
	}),
}));
