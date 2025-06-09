"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Deal } from "@/types/db";
import {
	getRestaurants,
	updateRestaurantDeal,
} from "@/db/models/restaurants/restaurants";
import { toast } from "sonner";

// Define a simplified restaurant type for the select dropdown
type SimpleRestaurant = {
	id: bigint;
	name: string;
};

// Define the props for the component
interface EditDealFormProps {
	id: string;
	deal: Deal & { restaurant?: { id: bigint; name: string } };
}

export function EditDealForm({ id, deal }: EditDealFormProps) {
	const router = useRouter();
	const [restaurants, setRestaurants] = useState<SimpleRestaurant[]>([]);
	const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);

	const [formData, setFormData] = useState({
		title: deal.title,
		content: deal.content,
		imageUrl: deal.imageUrl || "",
		active: deal.active,
		restaurantId: String(deal.restaurantId),
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch restaurants for the dropdown
	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				setIsLoadingRestaurants(true);
				const restaurantsList = await getRestaurants();
				// Simplify the restaurant data to only what we need for the dropdown
				const simpleRestaurants = restaurantsList.map((restaurant) => ({
					id: restaurant.id,
					name: restaurant.name,
				}));
				setRestaurants(simpleRestaurants);
			} catch (err) {
				console.error("Error fetching restaurants:", err);
				setError("Failed to load restaurants");
			} finally {
				setIsLoadingRestaurants(false);
			}
		};

		fetchRestaurants();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value, type } = e.target;

		if (type === "checkbox") {
			const checkbox = e.target as HTMLInputElement;
			setFormData({
				...formData,
				[name]: checkbox.checked,
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			// Validate form
			if (!formData.title.trim()) {
				throw new Error("Title is required");
			}

			if (!formData.content.trim()) {
				throw new Error("Content is required");
			}

			if (!formData.restaurantId) {
				throw new Error("Restaurant selection is required");
			}

			// Update the deal in the database
			await updateRestaurantDeal(BigInt(id), {
				title: formData.title,
				content: formData.content,
				active: formData.active,
				restaurantId: BigInt(formData.restaurantId),
			});

			toast.success("Deal updated", {
				description: "The deal has been successfully updated.",
			});

			// Redirect to deal detail page on success
			router.push(`/admin/deals/${id}`);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update deal");
			toast.error("Error", {
				description: "Failed to update the deal. Please try again.",
			});
			setIsSubmitting(false);
		}
	};

	if (error && !isSubmitting) {
		return (
			<div className="bg-red-50 border-l-4 border-red-500 p-4">
				<div className="flex">
					<div>
						<p className="text-sm text-red-700">{error}</p>
						<p className="mt-2">
							<button
								type="button"
								onClick={() => router.back()}
								className="text-red-700 hover:text-red-600 font-medium underline"
							>
								Go back
							</button>
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
					<div className="flex">
						<div>
							<p className="text-sm text-red-700">{error}</p>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{/* Deal Title */}
				<div className="col-span-2">
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700"
					>
						Deal Title <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#818cf8] focus:outline-none focus:ring-1 focus:ring-[#818cf8] sm:text-sm"
						placeholder="e.g., 'Happy Hour Special' or 'Weekend Brunch Offer'"
						required
					/>
				</div>

				{/* Deal Content / Description */}
				<div className="col-span-2">
					<label
						htmlFor="content"
						className="block text-sm font-medium text-gray-700"
					>
						Deal Description <span className="text-red-500">*</span>
					</label>
					<textarea
						id="content"
						name="content"
						value={formData.content}
						onChange={handleChange}
						rows={4}
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#818cf8] focus:outline-none focus:ring-1 focus:ring-[#818cf8] sm:text-sm"
						placeholder="Describe the deal in detail, including terms and conditions"
						required
					/>
				</div>

				{/* Restaurant Selection */}
				<div>
					<label
						htmlFor="restaurantId"
						className="block text-sm font-medium text-gray-700"
					>
						Restaurant <span className="text-red-500">*</span>
					</label>
					<select
						id="restaurantId"
						name="restaurantId"
						value={formData.restaurantId}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#818cf8] focus:outline-none focus:ring-1 focus:ring-[#818cf8] sm:text-sm"
						required
						disabled={isLoadingRestaurants}
					>
						<option value="">Select Restaurant</option>
						{restaurants.map((restaurant) => (
							<option key={String(restaurant.id)} value={String(restaurant.id)}>
								{restaurant.name}
							</option>
						))}
					</select>
					{isLoadingRestaurants && (
						<p className="mt-1 text-xs text-gray-500">Loading restaurants...</p>
					)}
				</div>

				{/* Image URL */}
				<div>
					<label
						htmlFor="imageUrl"
						className="block text-sm font-medium text-gray-700"
					>
						Image URL
					</label>
					<input
						type="text"
						id="imageUrl"
						name="imageUrl"
						value={formData.imageUrl}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#818cf8] focus:outline-none focus:ring-1 focus:ring-[#818cf8] sm:text-sm"
						placeholder="https://example.com/images/deal.jpg"
					/>
					<p className="mt-1 text-xs text-gray-500">
						Enter a URL for an image that represents this deal
					</p>
				</div>

				{/* Active Status */}
				<div className="col-span-2">
					<div className="flex items-center">
						<input
							type="checkbox"
							id="active"
							name="active"
							checked={formData.active}
							onChange={handleChange}
							className="h-4 w-4 rounded border-gray-300 text-[#818cf8] focus:ring-[#818cf8]"
						/>
						<label
							htmlFor="active"
							className="ml-2 block text-sm text-gray-700"
						>
							Active (immediately visible to users)
						</label>
					</div>
					<p className="mt-1 text-xs text-gray-500">
						If unchecked, the deal will be saved but not visible to users
					</p>
				</div>
			</div>

			{/* Form Actions */}
			<div className="flex justify-end space-x-3 pt-5">
				<button
					type="button"
					onClick={() => router.back()}
					className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#818cf8] focus:ring-offset-2"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="inline-flex justify-center rounded-md border border-transparent bg-[#818cf8] px-4 py-2 text-sm font-medium text-white hover:bg-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#818cf8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</form>
	);
}
