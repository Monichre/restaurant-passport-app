import { type NextRequest, NextResponse } from "next/server";
import { db, getDeals } from "@/db";
import { convertBigInts } from "@/lib/utils";
import { restaurantDeals, restaurants } from "@/db/drizzle/schema";

/**
 * GET /api/deals
 *
 * Retrieves all deals or deals for a specific restaurant
 *
 * Query parameters:
 * - restaurantId (optional): Filter deals by restaurant ID
 */
export async function GET(request: NextRequest) {
	try {
		// const { searchParams } = new URL(request.url);
		// const restaurantId = searchParams.get("restaurantId");
		const deals = await db.query.restaurantDeals.findMany({
			with: {
				restaurant: true,
			},
		});

		console.log("🚀 ~ GET ~ deals:", deals);

		// If restaurantId is provided, filter by it
		// if (restaurantId) {
		// 	const bigintId = BigInt(restaurantId);
		// 	query = query.where(eq(restaurantDeals.restaurantId, bigintId));
		// }

		// const deals = await query;

		return NextResponse.json({
			success: true,
			data: convertBigInts(deals),
		});
	} catch (error) {
		console.error("Error fetching deals:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch deals",
			},
			{ status: 500 },
		);
	}
}

/**
 * POST /api/deals
 *
 * Creates a new deal
 *
 * Body: {
 *   title: string;
 *   content: string;
 *   active: boolean;
 *   restaurantId: bigint;
 * }
 */

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate required fields
		if (
			!body.title ||
			!body.content ||
			body.active === undefined ||
			!body.restaurantId
		) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields",
				},
				{ status: 400 },
			);
		}

		// Convert restaurantId to BigInt
		const restaurantId = BigInt(body.restaurantId);

		// Check if restaurant exists
		const restaurantExists = await db.query.restaurants.findFirst({
			where: (restaurants, { eq }) => eq(restaurants.id, restaurantId),
			columns: { id: true },
		});

		if (!restaurantExists) {
			return NextResponse.json(
				{
					success: false,
					error: "Restaurant not found",
				},
				{ status: 404 },
			);
		}

		// Create the deal
		const result = await db
			.insert(restaurantDeals)
			.values({
				title: body.title,
				content: body.content,
				active: body.active,
				restaurantId,
			})
			.returning();

		const newDeal = result[0];

		return NextResponse.json({
			success: true,
			data: convertBigInts(newDeal),
		});
	} catch (error) {
		console.error("Error creating deal:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to create deal",
			},
			{ status: 500 },
		);
	}
}
