"use client";

import { useState, useEffect, useCallback } from "react";

import type { PunchCard } from "@/types/db";
import { getPunchCardsByUserId } from "@/db/models/punch-cards";
import { supabaseBrowserClient } from "@/db/supabase/supabase.client";

export type PunchCardWithRestaurant = {
	id: bigint;
	userId: bigint;
	restaurantId: bigint;
	punches: number;
	completed: boolean;
	updatedAt: string | null;
	restaurant: {
		id: bigint;
		name: string;
		description: string;
		imageUrl: string;
		address: string;
		qrCodeUrl: string | null;
	};
};

/**
 * A hook for subscribing to real-time punch card updates
 * @param userId The user ID to subscribe to punch cards for
 * @returns The updated punch cards array
 */
export function usePunchCardSubscription(userId: bigint) {
	const [punchCards, setPunchCards] = useState<PunchCardWithRestaurant[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchPunchCards = useCallback(async () => {
		try {
			setIsLoading(true);

			// Use the client-side API endpoint to get punch cards
			const response = await fetch(`/api/punch-cards?userId=${userId}`);

			if (!response.ok) {
				// throw new Error("Failed to fetch punch cards");
			}

			const { success, data, error } = await response.json();

			console.log("🚀 ~ fetchPunchCards ~ error:", error);

			console.log("🚀 ~ fetchPunchCards ~ data:", data);

			if (!success) {
				// throw new Error(error || "Failed to fetch punch cards");
			}

			console.log("🚀 ~ fetchPunchCards ~ punchCards:", data);
			setPunchCards(data);
		} catch (err) {
			console.error("Error fetching punch cards:", err);
			setError(
				err instanceof Error ? err : new Error("Unknown error occurred"),
			);
		} finally {
			setIsLoading(false);
		}
	}, [userId]);

	// Fetch initial punch cards
	useEffect(() => {
		if (userId) {
			fetchPunchCards();
		}
	}, [userId, fetchPunchCards]);

	// Set up real-time subscription
	useEffect(() => {
		if (!userId) return;

		// Convert bigint to string for the subscription
		const userIdStr = userId.toString();

		console.log("🚀 ~ useEffect ~ userIdStr:", userIdStr);

		// Subscribe to punch card changes for this user
		const subscription = supabaseBrowserClient
			.channel("punch-cards")
			.on(
				"postgres_changes",
				{
					event: "*", // Listen to all events (insert, update, delete)
					schema: "public",
					table: "punch_cards",
					filter: `user_id=eq.${userIdStr}`,
				},
				async (payload) => {
					console.log("Punch card change received:", payload);

					try {
						// Refresh the data using the API endpoint
						const response = await fetch(`/api/punch-cards?userId=${userId}`);

						if (!response.ok) {
							// throw new Error("Failed to fetch updated punch cards");
						}

						const { success, data, error } = await response.json();

						console.log("🚀 ~ success:", success);

						console.log("🚀 ~ data:", data);

						if (!success) {
							// throw new Error(error || "Failed to fetch updated punch cards");
						}

						setPunchCards(data);
					} catch (err) {
						console.error("Error updating punch cards:", err);
					}
				},
			)
			.subscribe();

		console.log("🚀 ~ useEffect ~ subscription:", subscription);
		// Clean up subscription on unmount
		return () => {
			subscription.unsubscribe();
		};
	}, [userId]);

	return {
		punchCards,
		isLoading,
		error,
	};
}
