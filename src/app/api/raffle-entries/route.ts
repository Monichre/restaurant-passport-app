import { NextResponse } from "next/server";
import {
	getRaffleEntries,
	getRaffleEntriesByUserId,
} from "@/db/models/raffle-entries";
import { db } from "@/db/db";
import { restaurants, punchCards } from "@/db/drizzle/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		let entriesWithDetails;

		if (userId) {
			// Fetch raffle entries for specific user
			const userIdBigInt = BigInt(userId);
			entriesWithDetails = await db.query.raffleEntries.findMany({
				where: (raffleEntries, { eq }) =>
					eq(raffleEntries.userId, userIdBigInt),
				with: {
					punchCard: {
						with: {
							restaurant: true,
						},
					},
					user: true,
				},
			});
		} else {
			// Fetch all raffle entries
			entriesWithDetails = await db.query.raffleEntries.findMany({
				with: {
					punchCard: {
						with: {
							restaurant: true,
						},
					},
					user: true,
				},
			});
		}

		// Transform the data for the UI
		const formattedData = entriesWithDetails.map((entry) => ({
			id: entry.id,
			userId: entry.userId,
			punchCardId: entry.punchCardId,
			createdAt: entry.createdAt,
			name: `Raffle Entry #${entry.id}`,
			description: `Created at ${new Date(entry.createdAt).toLocaleString()} for punch card ${entry.punchCardId}`,
			imageUrl: "/images/raffle-placeholder.jpg", // Default image since we don't have prize info
			restaurant: entry.punchCard?.restaurant || {
				id: BigInt(0),
				name: "Unknown Restaurant",
				description: "",
				imageUrl: "/images/restaurant-placeholder.jpg",
				address: "",
				qrCodeUrl: null,
			},
		}));

		return NextResponse.json({ success: true, data: formattedData });
	} catch (error) {
		console.error("Unexpected error in raffle entries API:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
