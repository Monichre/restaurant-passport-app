import { getRestaurants } from "@/db/models";
import { BulkQRPage } from "../bulk-qr";
import type { Restaurant } from "@/types/db";

export default async function BulkQRCodePage() {
	const restaurantsData = await getRestaurants();

	// Process the data to ensure it matches the Restaurant type
	const restaurants = restaurantsData.map((restaurant) => {
		// Create a type-safe restaurant object
		const safeRestaurant: Restaurant = {
			id: restaurant.id,
			name: restaurant.name || "Unknown Restaurant",
			description: restaurant.description || "No description available",
			imageUrl: restaurant.imageUrl || "/placeholder.jpg",
			address: restaurant.address || "No address provided",
			qrCodeUrl: restaurant.qrCodeUrl || null,
		};

		return safeRestaurant;
	});

	return <BulkQRPage restaurants={restaurants} />;
}
