import { getPunchCardsByUserId } from "@/db/models/punch-cards";
import { convertBigInts } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		// Get the user ID from the query parameters
		const url = new URL(req.url);

		console.log("🚀 ~ GET ~ url:", url);

		const targetUserId = url.searchParams.get("userId");

		console.log("🚀 ~ GET ~ targetUserId:", targetUserId);

		if (!targetUserId) {
			return NextResponse.json(
				{ error: "Missing userId parameter" },
				{ status: 400 },
			);
		}

		// Fetch the punch cards for the user
		const punchCards = await getPunchCardsByUserId(BigInt(targetUserId));

		console.log("🚀 ~ GET ~ punchCards:", punchCards);

		return NextResponse.json({
			success: true,
			data: convertBigInts(punchCards),
		});
	} catch (error) {
		console.error("Error fetching punch cards:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch punch cards",
			},
			{ status: 500 },
		);
	}
}
