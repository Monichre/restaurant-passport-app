import {
	createPunchCard,
	getUserPunchCardForRestaurant,
	incrementPunchCard,
	getPunchCardsByUserId,
	updatePunchCard,
} from "@/db/models/punch-cards/punch-cards";
import { getRestaurantById } from "@/db/models/restaurants/restaurants";
import { PUNCH_THRESHOLD } from "@/components/ui/restaurant-specific-user-punch-card";
import type { PunchCard } from "@/types/db";
import {
	createRaffleEntry,
	getRaffleEntriesByUserId,
} from "@/db/models/raffle-entries/raffle-entries";

// NEW: Helper to safely serialize data with BigInt conversion
const safeJson = (data: unknown) =>
	JSON.stringify(data, (_, value) =>
		typeof value === "bigint" ? value.toString() : value,
	);

export async function POST(request: Request) {
	console.log("🚀 ~ POST ~ request:", request);

	// Extract restaurant ID from URL
	const restaurantId = request.url.match(/restaurants\/(\d+)\/scan/)?.[1] ?? "";
	console.log("🚀 ~ POST ~ restaurantId:", restaurantId);

	// Parse request body
	const body = await request.json();
	console.log("🚀 ~ POST ~ body:", body);

	if (!restaurantId || !body?.userId) {
		return new Response(
			safeJson({
				message: "Missing required data",
				error: "Restaurant ID and user ID are required",
			}),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const userId: string | number = body.userId;
	console.log("🚀 ~ POST ~ userId:", userId);

	// Get restaurant details
	const restaurant = await getRestaurantById(BigInt(restaurantId));
	if (!restaurant) {
		return new Response(
			safeJson({
				message: "Restaurant not found",
				error: "The restaurant does not exist",
			}),
			{ status: 404, headers: { "Content-Type": "application/json" } },
		);
	}

	// Check if punch card already exists
	const existingPunchCard: PunchCard | any =
		await getUserPunchCardForRestaurant(BigInt(userId), BigInt(restaurantId));

	console.log("🚀 ~ POST ~ existingPunchCard:", existingPunchCard);

	if (existingPunchCard) {
		// Increment existing punch card
		return Response.json({
			message: "Punch card already exists",
			data: existingPunchCard,
			status: 200,
			success: false,
		});
	}

	// Create new punch card
	const punchCardData: PunchCard | any = await createPunchCard({
		userId: BigInt(userId),
		restaurantId: BigInt(restaurantId),
		punches: 1,
		completed: true,
	});

	console.log("🚀 ~ POST ~ punchCardData:", punchCardData);

	// Check if the punch card is now completed

	// Check if user has 8 completed punch cards (including this one)
	const userPunchCards = await getPunchCardsByUserId(BigInt(userId));
	const completedPunchCardsTotal = userPunchCards.length;
	const existingRaffleEntries = await getRaffleEntriesByUserId(BigInt(userId));

	if (
		completedPunchCardsTotal >= 8 &&
		(!existingRaffleEntries || existingRaffleEntries.length === 0)
	) {
		// If user has 8 completed punch cards and no raffle entry, create one
		// Check if user already has a raffle entry

		const raffleEntry = await createRaffleEntry({
			userId: BigInt(userId),
			punchCardId: punchCardData.id,
		});

		console.log("🚀 ~ POST ~ raffleEntry:", raffleEntry);

		return Response.json({
			message: "New punch card created and raffle entry added",
			data: {
				punchCardData,
				restaurant,
				raffleEntry,
			},
			success: true,
			status: 200,
		});
	}

	return Response.json({
		message: "New punch card created",
		data: {
			punchCardData,
			restaurant,
		},
		success: true,
		status: 200,
	});
}
