"use client";

import { getUserRestaurantPunchCard } from "@/db/models/punch-cards/punch-cards";
import { UserPunchCard } from "@/features/users/UserPunchCard";
import type { PunchCard, Restaurant } from "@/types/db";
import { use, useEffect, useState } from "react";

export const GetUserRestaurantPunchCard = ({
	restaurant,
	userId,
}: { restaurant: Restaurant; userId: bigint }) => {
	const [punchCard, setPunchCard] = useState<PunchCard | null>(null);
	console.log("🚀 ~ userId:", userId);

	console.log("🚀 ~ restaurant:", restaurant);

	useEffect(() => {}, [userId, restaurant.id]);

	console.log("🚀 ~ punchCard:", punchCard);

	if (!punchCard || !punchCard.length) {
		return null;
	}

	// @ts-ignore
	return <UserPunchCard restaurant={restaurant} punchCard={punchCard} />;
};
