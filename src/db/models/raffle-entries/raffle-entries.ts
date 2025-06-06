"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { raffleEntries } from "@/db/drizzle/schema";

export const getRaffleEntries = async () => {
	return await db.query.raffleEntries.findMany({
		with: {
			punchCard: {
				with: {
					restaurant: true,
				},
			},
			user: true,
		},
	});
};
export const getRaffleEntryById = async (id: bigint) => {
	// This returns a single item (or null if not found), not an array
	// The findFirst method returns the first matching record or null
	return await db.query.raffleEntries.findFirst({
		where: eq(raffleEntries.id, id),
		with: {
			punchCard: {
				with: {
					restaurant: true,
				},
			},
			user: true,
		},
	});
};

export const getRaffleEntriesByUserId = async (userId: bigint) => {
	return await db.query.raffleEntries.findFirst({
		where: eq(raffleEntries.userId, userId),
		with: {
			punchCard: {
				with: {
					restaurant: true,
				},
			},
			user: true,
		},
	});
};

export const getRaffleEntriesByPunchCardId = async (punchCardId: bigint) => {
	return await db
		.select()
		.from(raffleEntries)
		.where(eq(raffleEntries.punchCardId, punchCardId));
};

export const createRaffleEntry = async (data: {
	userId: bigint;
	punchCardId: bigint;
}) => {
	return await db.insert(raffleEntries).values(data).returning();
};

export const deleteRaffleEntry = async (id: bigint) => {
	return await db
		.delete(raffleEntries)
		.where(eq(raffleEntries.id, id))
		.returning();
};
