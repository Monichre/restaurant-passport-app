"use client";

import { useState, useEffect, useCallback } from "react";
import type { RaffleEntry } from "@/types/db";
import { supabaseBrowserClient } from "@/db/supabase/supabase.client";

export type RaffleEntryWithRestaurant = RaffleEntry & {
	restaurant?: {
		id: bigint;
		name: string;
		imageUrl: string;
		address: string;
	};
};

/**
 * A hook for subscribing to real-time raffle entry updates
 * @param userId The user ID to subscribe to raffle entries for
 * @returns The updated raffle entries array
 */
export function useRaffleEntriesSubscription(userId: bigint) {
	const [raffleEntries, setRaffleEntries] = useState<
		RaffleEntryWithRestaurant[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchRaffleEntries = useCallback(async () => {
		try {
			setIsLoading(true);

			// Use the client-side API endpoint to get raffle entries
			const response = await fetch(`/api/raffle-entries?userId=${userId}`);

			if (!response.ok) {
				throw new Error("Failed to fetch raffle entries");
			}

			const { success, data, error } = await response.json();

			if (!success) {
				throw new Error(error || "Failed to fetch raffle entries");
			}

			setRaffleEntries(data);
		} catch (err) {
			console.error("Error fetching raffle entries:", err);
			setError(
				err instanceof Error ? err : new Error("Unknown error occurred"),
			);
		} finally {
			setIsLoading(false);
		}
	}, [userId]);

	// Fetch initial raffle entries
	useEffect(() => {
		if (userId) {
			fetchRaffleEntries();
		}
	}, [userId, fetchRaffleEntries]);

	// Set up real-time subscription
	useEffect(() => {
		if (!userId) return;

		// Convert bigint to string for the subscription
		const userIdStr = userId.toString();

		// Subscribe to raffle entry changes for this user
		const subscription = supabaseBrowserClient
			.channel("raffle-entries")
			.on(
				"postgres_changes",
				{
					event: "*", // Listen to all events (insert, update, delete)
					schema: "public",
					table: "raffle_entries",
					filter: `user_id=eq.${userIdStr}`,
				},
				async () => {
					try {
						// Refresh the data using the API endpoint
						await fetchRaffleEntries();
					} catch (err) {
						console.error("Error updating raffle entries:", err);
					}
				},
			)
			.subscribe();

		// Clean up subscription on unmount
		return () => {
			subscription.unsubscribe();
		};
	}, [userId, fetchRaffleEntries]);

	return {
		raffleEntries,
		isLoading,
		error,
	};
}
