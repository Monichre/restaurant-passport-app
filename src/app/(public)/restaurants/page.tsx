import Link from "next/link";
import Image from "next/image";

import { getRestaurants } from "@/db/models/restaurants/restaurants";
import type { Restaurant } from "@/types/db";
import { RestaurantsList } from "@/features/restaurants/RestaurantList";

export default async function RestaurantsPage() {
	const restaurants = await getRestaurants();
	return (
		<div className="px-4 py-8 h-full w-full overflow-auto">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Restaurants</h1>
				<Link
					href="/"
					className="text-blue-600 hover:text-blue-800 transition-colors"
				>
					Back to Home
				</Link>
			</div>

			<div className="mb-8">
				<p className="text-gray-600">
					Explore our partner restaurants and start collecting stamps on your
					food passport!
				</p>
			</div>

			<RestaurantsList restaurants={restaurants} />
		</div>
	);
}
