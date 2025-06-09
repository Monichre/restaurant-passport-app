import { RestaurantForm } from "@/components/admin/restaurant-form";
import React from "react";

export const metadata = {
	title: "Add Restaurant | Admin Dashboard",
	description: "Add a new restaurant to the system",
};

export default function NewRestaurantPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Add New Restaurant</h1>
			<div className="bg-white rounded-lg shadow-sm p-6">
				<RestaurantForm />
			</div>
		</div>
	);
}
