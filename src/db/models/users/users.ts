"use server";

import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "@/db/drizzle/schema";
import type { User } from "@/types/db";

export const getUsers = async () => {
	return await db.query.users.findMany({
		with: {
			punchCards: true,

			raffleEntries: true,
		},
	});
};
export const getUserById = async (id: bigint) => {
	return await db.query.users.findFirst({
		where: eq(users.id, id),
		with: {
			punchCards: {
				with: {
					restaurant: true,
				},
			},

			raffleEntries: true,
		},
	});
};

export const getUserByClerkId = async (clerkId: string) => {
	const user = await db.query.users.findFirst({
		where: eq(users.clerkId, clerkId),
		with: {
			punchCards: {
				with: {
					restaurant: true,
				},
			},

			raffleEntries: true,
		},
	});
	console.log(user);
	return user;
};

export const getUserByClerkIdWithPunchCards = async (clerkId: string) => {
	const user = await db.query.users.findFirst({
		where: eq(users.clerkId, clerkId),
		with: {
			punchCards: {
				with: {
					restaurant: true,
				},
			},

			raffleEntries: true,
		},
	});
	console.log(user);
	return user;
};
export const createUser = async (data: {
	clerkId: string;
	name: string;
	email: string;
	isStaff?: boolean;
	isAdmin?: boolean;
}) => {
	return await db.insert(users).values(data).returning();
};

export const updateUser = async (
	id: bigint,
	data: Partial<{
		name: string;
		isStaff: boolean;
		isAdmin: boolean;
	}>,
) => {
	return await db.update(users).set(data).where(eq(users.id, id)).returning();
};

export const deleteUser = async (id: bigint) => {
	return await db.delete(users).where(eq(users.id, id)).returning();
};
