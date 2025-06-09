"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/types/db";

// Placeholder for PageHeader component
export function PageHeader({
	heading,
	subheading,
}: { heading: string; subheading: string }) {
	return (
		<div className="space-y-1">
			<h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
			<p className="text-muted-foreground">{subheading}</p>
		</div>
	);
}

// Placeholder for AddRestaurantDialog component
export function AddRestaurantDialog({ children }: { children: ReactNode }) {
	return <div>{children}</div>;
}

// Placeholder for RestaurantsList component
export function RestaurantsList({
	restaurants,
}: { restaurants: Restaurant[] }) {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{restaurants.map((restaurant) => (
				<div
					key={restaurant.id.toString()}
					className="rounded-lg border bg-card text-card-foreground shadow"
				>
					<div className="p-6 space-y-2">
						<h3 className="text-lg font-medium">{restaurant.name}</h3>
						<p className="text-sm text-muted-foreground">
							{restaurant.address}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
