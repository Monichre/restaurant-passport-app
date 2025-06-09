import { type NextRequest, NextResponse } from "next/server";
import { getPunchCardsByUserId } from "@/db/models/punch-cards/punch-cards";
import { auth } from "@clerk/nextjs/server";

import type { ApiResponse } from "@/types/api";
import { getUserByClerkId } from "@/db";
import { convertBigIntToString } from "@/lib/utils";

export async function GET(
	request: NextRequest,
	context: { params: { id: string } },
) {
	console.log("🚀 ~ context:", context);

	console.log("🚀 ~ request:", request);

	try {
		// Get the authenticated user from Clerk
		const { userId: clerkId } = await auth();
		// If not authenticated, return 401
		if (!clerkId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" } as ApiResponse,
				{ status: 401 },
			);
		}

		const dbUser: any = await getUserByClerkId(clerkId);

		// Extract params safely
		const params = await context.params;
		const { id } = params;

		console.log("🚀 ~ id:", id);

		// if (!id) {
		// 	return NextResponse.json(
		// 		{ success: false, error: "User ID is required" } as ApiResponse,
		// 		{ status: 400 },
		// 	);
		// }

		const userId = BigInt(dbUser?.id);

		console.log("🚀 ~ userId:", userId);

		// Get the user's punch cards with restaurant information
		const punchCards = await getPunchCardsByUserId(userId);

		// Convert bigint to string for JSON serialization
		const serializedPunchCards = convertBigIntToString(punchCards);

		return NextResponse.json(
			{
				success: true,
				data: serializedPunchCards,
			} as ApiResponse,
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching punch cards:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch punch cards",
			} as ApiResponse,
			{ status: 500 },
		);
	}
}
