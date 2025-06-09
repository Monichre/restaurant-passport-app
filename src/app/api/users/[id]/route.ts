import { type NextRequest, NextResponse } from "next/server";
import { getPunchCardsByUserId } from "@/db/models/punch-cards/punch-cards";
import { auth } from "@clerk/nextjs/server";

import type { ApiResponse } from "@/types/api";
import { convertBigInts } from "@/lib/utils";
import { getUserByClerkId } from "@/db/models/users/users";

export async function GET(
	request: NextRequest,
	context: { params: { id: string } },
) {
	console.log("🚀 ~ context:", context);

	console.log("🚀 ~ request:", request);

	try {
		// Get the authenticated user from Clerk
		const { userId: clerkId }: any = await auth();

		console.log("🚀 ~ clerkId:", clerkId);

		const dbUser = await getUserByClerkId(clerkId);

		console.log("🚀 ~ dbUser:", dbUser);

		return NextResponse.json(
			{
				success: true,
				data: convertBigInts(dbUser),
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
