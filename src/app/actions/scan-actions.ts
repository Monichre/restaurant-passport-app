"use server";

import { auth } from "@clerk/nextjs/server";
import {
	createPunchCard,
	getPunchCardsByUserId,
	getUserPunchCardForRestaurant,
	incrementPunchCard,
} from "@/db/models/punch-cards/punch-cards";
import { createRaffleEntry } from "@/db/models/raffle-entries/raffle-entries";
import { getRestaurantById } from "@/db/models/restaurants/restaurants";
import { getUserByClerkId, getUserById } from "@/db/models/users/users";
import { convertBigInts } from "@/lib/utils";
import { extractRestaurantIdFromUrl, isValidRestaurantId } from "@/utils/url-parsing";

export async function processQrScan(formData: {
	qrData: string;
	userId: string | number | bigint;
}) {
	const { qrData, userId } = formData;

	console.log("🚀 ~ processQrScan received qrData:", qrData);
	
	const { userId: clerkUserId } = await auth();
	
	console.log("🚀 ~ processQrScan ~ clerkUserId:", clerkUserId);
	let user;
	try {
		// Attempt to parse the QR data if it's a JSON string
		let qrDataString = qrData;

		// Try to parse JSON if the string looks like JSON
		if (
			typeof qrData === "string" &&
			(qrData.startsWith("{") || qrData.startsWith("["))
		) {
			try {
				const parsed = JSON.parse(qrData);
				if (parsed && typeof parsed === "object") {
					// If parsed successfully, check for common QR result properties
					if ("text" in parsed) {
						qrDataString = parsed.text;
					} else if ("data" in parsed) {
						qrDataString = parsed.data;
					} else if ("url" in parsed) {
						qrDataString = parsed.url;
					}
				}
			} catch (parseError) {
				// If JSON parsing fails, use the original string
				console.log("Failed to parse QR data as JSON, using as-is");
			}
		}

		console.log("🚀 ~ Processing QR data as:", qrDataString);
		
		const restaurantId = extractRestaurantIdFromUrl(qrDataString);
		console.log("🚀 ~ restaurantId extracted from URL:", restaurantId);
		console.log("🚀 ~ URL parsing input:", qrDataString);
		console.log("🚀 ~ URL parsing result:", restaurantId ? `Found ID: ${restaurantId}` : "No ID found");
		
		const numericRestaurantId = restaurantId;

		console.log("🚀 ~ numericRestaurantId:", numericRestaurantId);

		if (!numericRestaurantId || !isValidRestaurantId(numericRestaurantId)) {
			console.log("🚀 ~ Restaurant ID validation failed:", {
				numericRestaurantId,
				isValid: numericRestaurantId ? isValidRestaurantId(numericRestaurantId) : false,
				originalUrl: qrDataString
			});
			return {
				error: "Missing restaurant ID",
				message: "Restaurant ID is required",
				status: 400,
			};
		}

		if (!userId && !clerkUserId) {
			console.log("🚀 ~ processQrScan ~ redirecting out-of-app user to restaurant page");
			return {
				redirect: `https://experiencemaplegrove.app/restaurants/${numericRestaurantId}`,
				message: "Please sign up to collect punch cards",
				status: 302,
			};
		}

		if (!userId && clerkUserId) {
			console.log("🚀 ~ processQrScan ~ user authenticated via Clerk but no userId provided");
			return {
				error: "User ID is required",
				message: "User ID is required for authenticated users",
				status: 400,
			};
		}

		// Check if userId is a string that doesn't represent a number (likely a Clerk ID)
		console.log("Processing userId:", userId, "Type:", typeof userId);

		let userIdBigInt: bigint;

		if (typeof userId === "bigint") {
			userIdBigInt = userId;
		} else {
			const userIdStr = String(userId).trim();
			console.log("userId as string:", userIdStr);

			// Check if the userId string is a numeric value or a Clerk ID
			if (!/^\d+$/.test(userIdStr)) {
				console.log(
					"userId appears to be a Clerk ID, fetching database user ID",
				);
				// If it's not a numeric string, assume it's a Clerk ID and get the real user ID
				user = await getUserByClerkId(userIdStr);

				if (!user || !user.id) {
					throw new Error(`User not found with Clerk ID: ${userIdStr}`);
				}

				console.log("Found user in database with ID:", user.id);
				userIdBigInt = user.id;
			} else {
				// If it's a numeric string, convert it to BigInt
				userIdBigInt = BigInt(userIdStr);
				user = await getUserById(userIdBigInt);
			}
		}

		console.log(
			"Successfully resolved userId to BigInt:",
			userIdBigInt.toString(),
		);

		// Convert restaurant ID to BigInt
		console.log(
			"Converting restaurantId to BigInt:",
			numericRestaurantId,
			"Type:",
			typeof numericRestaurantId,
		);

		// Make absolutely sure we have a valid numeric string
		if (!numericRestaurantId || !/^\d+$/.test(numericRestaurantId)) {
			throw new Error(`Invalid restaurant ID format: ${numericRestaurantId}`);
		}

		const restaurantIdBigInt = BigInt(numericRestaurantId);
		console.log("Successfully converted to BigInt");

		// Get restaurant details for response
		const restaurant = await getRestaurantById(restaurantIdBigInt);

		// Check if punch card already exists
		const punchCardExists = await getUserPunchCardForRestaurant(
			userIdBigInt,
			restaurantIdBigInt,
		);

		console.log("🚀 ~ punchCardExists:", punchCardExists);

		if (punchCardExists) {
			console.log("🚀 ~ punchCardExists:", punchCardExists);

			return {
				message: "Punch card already exists. Venture out my friend!",
				data: convertBigInts(punchCardExists), // updatedPunchCard?.[0] ||
				restaurantName: restaurant?.name || "Restaurant",
				isExisting: true,
			};
		}

		const userPunchCards = await getPunchCardsByUserId(userIdBigInt);

		console.log("🚀 ~ userPunchCards:", userPunchCards);

		const punchCardCount = userPunchCards.length;

		console.log("🚀 ~ punchCardCount:", punchCardCount);

		if (punchCardCount === 6) {
			return {
				message: `You have 6 Punch Cards and have already entered the raffle.`,
				data: null,
				success: false,
			};
		}
		if (punchCardCount === 5) {
			// Create new punch card if it doesn't exist
			const punchCard = await createPunchCard({
				userId: userIdBigInt,
				restaurantId: restaurantIdBigInt,
				punches: 1,
				completed: true, // Set to false initially
			}).then((res) => res[0]);

			console.log("🚀 ~ last punch card initiate raffle Entry :", punchCard);
			const raffleEntry = await createRaffleEntry({
				userId: userIdBigInt,
				punchCardId: punchCard.id,
			}).then((res) => res[0]);

			console.log("🚀 ~ raffleEntry:", raffleEntry);
			return {
				message: `Congrats! ${user?.name}! You've entered the raffle!`,
				data: {
					raffleEntry,
					punchCard,
				},
				success: true,
			};
		}
		// Create new punch card if it doesn't exist
		const punchCard = await createPunchCard({
			userId: userIdBigInt,
			restaurantId: restaurantIdBigInt,
			punches: 1,
			completed: true, // Set to false initially
		}).then((res) => res[0]);

		console.log("🚀 ~ punchCard:", punchCard);

		return {
			message: "Punch card created successfully",
			data: convertBigInts(punchCard),
			restaurantName: restaurant?.name || "Restaurant",
			isExisting: false,
		};
	} catch (error) {
		console.error("Error processing QR scan:", error);

		// Check if this is a BigInt conversion error
		if (error instanceof Error && error.message.includes("BigInt")) {
			return {
				error: "Invalid data format",
				message: "The QR code contains invalid restaurant ID format",
				status: 400,
			};
		}

		// Check if this is a user not found error
		if (error instanceof Error && error.message.includes("User not found")) {
			return {
				error: "User not found",
				message: error.message,
				status: 404,
			};
		}

		return {
			error: "Failed to process QR scan",
			message: (error as Error).message,
			status: 500,
		};
	}
}
