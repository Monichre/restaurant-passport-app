"use server";

import {
	createPunchCard,
	getUserPunchCardForRestaurant,
	incrementPunchCard,
} from "@/db/models/punch-cards/punch-cards";
import { getRestaurantById } from "@/db/models/restaurants/restaurants";
import { getUserByClerkId } from "@/db/models/users/users";
import { convertBigInts } from "@/lib/utils";

export async function processQrScan(formData: {
	qrData: string;
	userId: string | number | bigint;
}) {
	const { qrData, userId } = formData;

	console.log("🚀 ~ processQrScan received qrData:", qrData);

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
			const restaurantId = qrDataString.match(/restaurants\/(\d+)\/scan/)?.[1] ?? "";
			console.log("🚀 ~ restaurantId:", restaurantId)
		console.log("🚀 ~ POST ~ restaurantId:", restaurantId);
		const numericRestaurantId = restaurantId?.replace(/\D/g, "");

		console.log("🚀 ~ numericRestaurantId:", numericRestaurantId)


		// Parse the QR URL to extract restaurant ID
		// const qrCodeUrl = new URL(qrDataString);

		// console.log("🚀 ~ qrCodeUrl:", qrCodeUrl);

		// const pathname = qrCodeUrl.pathname;
		// // Extract only numeric part from the path to ensure valid BigInt conversion
		// const pathParts = pathname.split("/").filter(Boolean);
		// const restaurantId = pathParts.pop();
		// const numericRestaurantId = restaurantId?.replace(/\D/g, "");

		// console.log("🚀 ~ Extracted restaurant ID:", numericRestaurantId);

		if (!numericRestaurantId || !userId) {
			return {
				error: "Missing required parameters",
				message: "User ID and restaurant ID are required",
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
				const user = await getUserByClerkId(userIdStr);

				if (!user || !user.id) {
					throw new Error(`User not found with Clerk ID: ${userIdStr}`);
				}

				console.log("Found user in database with ID:", user.id);
				userIdBigInt = user.id;
			} else {
				// If it's a numeric string, convert it to BigInt
				userIdBigInt = BigInt(userIdStr);
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

		console.log("🚀 ~ punchCardExists:", punchCardExists)


		if (punchCardExists) {

			console.log("🚀 ~ punchCardExists:", punchCardExists)

			// If punch card exists, increment the punches
			// const updatedPunchCard = await incrementPunchCard(
			// 	punchCardExists.id,
			// 	1, // Increment by 1
			// );

			return {
				message: "Punch card already exists and was updated",
				data: convertBigInts( punchCardExists), // updatedPunchCard?.[0] ||
				restaurantName: restaurant?.name || "Restaurant",
				isExisting: true,
			};
		} else {

			// Create new punch card if it doesn't exist
			const punchCard = await createPunchCard({
				userId: userIdBigInt,
				restaurantId: restaurantIdBigInt,
				punches: 1,
				completed: true, // Set to false initially
			}).then((res) => res[0]);
	
			console.log("🚀 ~ punchCard:", punchCard)
	
	
			return {
				message: "Punch card created successfully",
				data: convertBigInts(punchCard),
				restaurantName: restaurant?.name || "Restaurant",
				isExisting: false,
			};
		}

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
