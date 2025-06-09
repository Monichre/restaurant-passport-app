"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Store, Edit, Trash2 } from "lucide-react";
import type { Deal, Restaurant } from "@/types/db";

// Mock data for testing - this would be replaced with actual API calls
const getMockDeal = (
	id: string,
): (Deal & { restaurant?: Restaurant }) | null => {
	const deals = [
		{
			id: BigInt(1),
			title: "Half-price Appetizers",
			content: "Enjoy half-price appetizers every Tuesday from 5-7pm.",
			imageUrl: "/images/deals/appetizers.jpg",
			active: true,
			restaurantId: BigInt(1),
			createdAt: new Date("2023-06-15"),
			updatedAt: new Date("2023-06-15"),
			restaurant: {
				id: BigInt(1),
				name: "Pasta Paradise",
				description: "Authentic Italian cuisine",
				imageUrl: "/images/restaurants/pasta-paradise.jpg",
				address: "123 Main St, Anytown, USA",
				qrCodeUrl: null,
			},
		},
		{
			id: BigInt(2),
			title: "Buy One Get One Free",
			content:
				"Buy one entrée and get one of equal or lesser value for free. Valid Monday-Thursday.",
			imageUrl: "/images/deals/bogo.jpg",
			active: true,
			restaurantId: BigInt(2),
			createdAt: new Date("2023-07-01"),
			updatedAt: new Date("2023-07-10"),
			restaurant: {
				id: BigInt(2),
				name: "Burger Barn",
				description: "Gourmet burgers and craft beers",
				imageUrl: "/images/restaurants/burger-barn.jpg",
				address: "456 Oak St, Anytown, USA",
				qrCodeUrl: null,
			},
		},
		{
			id: BigInt(3),
			title: "Free Dessert with Purchase",
			content:
				"Receive a free dessert with any purchase over $25. Limited time offer.",
			imageUrl: "/images/deals/dessert.jpg",
			active: false,
			restaurantId: BigInt(1),
			createdAt: new Date("2023-05-20"),
			updatedAt: new Date("2023-07-15"),
			restaurant: {
				id: BigInt(1),
				name: "Pasta Paradise",
				description: "Authentic Italian cuisine",
				imageUrl: "/images/restaurants/pasta-paradise.jpg",
				address: "123 Main St, Anytown, USA",
				qrCodeUrl: null,
			},
		},
	];

	const parsedId = BigInt(id);
	return deals.find((deal) => deal.id === parsedId) || null;
};

interface DealDetailProps {
	id: string;
}

export function DealDetail({ id }: DealDetailProps) {
	const router = useRouter();
	const [deal, setDeal] = useState<(Deal & { restaurant?: Restaurant }) | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Fetch deal data - in a real app, this would be an API call
		const fetchDeal = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				const dealData = getMockDeal(id);
				if (!dealData) {
					setError("Deal not found");
				} else {
					setDeal(dealData);
				}
			} catch (err) {
				setError("Failed to load deal details");
				console.error("Error fetching deal:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDeal();
	}, [id]);

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this deal?")) {
			return;
		}

		try {
			setIsDeleting(true);

			// In a real app, this would be an API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Redirect to deals listing page on success
			router.push("/admin/deals");
			router.refresh();
		} catch (err) {
			setError("Failed to delete deal");
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-gray-200 rounded w-1/3" />
					<div className="h-6 bg-gray-200 rounded w-1/4" />
					<div className="h-32 bg-gray-200 rounded" />
					<div className="h-6 bg-gray-200 rounded w-1/2" />
					<div className="h-6 bg-gray-200 rounded w-1/4" />
				</div>
			</div>
		);
	}

	if (error || !deal) {
		return (
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="text-center text-red-600">
					<h3 className="text-lg font-medium">{error || "Deal not found"}</h3>
					<p className="mt-2">
						<Link href="/admin/deals" className="text-blue-500 hover:underline">
							Return to deals
						</Link>
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden">
			{/* Header with actions */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-gray-200">
				<div>
					<h2 className="text-xl font-semibold text-gray-900">{deal.title}</h2>
					<div className="mt-1 flex items-center text-sm text-gray-500">
						<Store className="mr-1.5 h-4 w-4" />
						<span>{deal.restaurant?.name}</span>
					</div>
				</div>

				<div className="flex items-center mt-4 md:mt-0 space-x-3">
					<Link
						href={`/admin/deals/${id}/edit`}
						className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<Edit className="mr-2 h-4 w-4" /> Edit
					</Link>
					<button
						type="button"
						onClick={handleDelete}
						disabled={isDeleting}
						className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
					>
						<Trash2 className="mr-2 h-4 w-4" />{" "}
						{isDeleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>

			{/* Deal content */}
			<div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Left column: Image and status */}
				<div className="md:col-span-1">
					<div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200">
						{deal.imageUrl ? (
							<Image
								src={deal.imageUrl}
								alt={deal.title}
								fill
								className="object-cover"
							/>
						) : (
							<div className="h-full w-full bg-gray-100 flex items-center justify-center">
								<span className="text-gray-400">No image available</span>
							</div>
						)}
					</div>

					<div className="mt-4">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium text-gray-900">Status</h3>
							<span
								className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
									deal.active
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{deal.active ? "Active" : "Inactive"}
							</span>
						</div>

						<div className="mt-4 space-y-3">
							<div className="flex items-center text-sm">
								<Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
								<span className="text-gray-500">
									Created: {deal.createdAt.toLocaleDateString()}
								</span>
							</div>
							<div className="flex items-center text-sm">
								<Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
								<span className="text-gray-500">
									Last updated: {deal.updatedAt.toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Right column: Description and additional info */}
				<div className="md:col-span-2">
					<div>
						<h3 className="text-lg font-medium text-gray-900">Description</h3>
						<div className="mt-2 text-gray-600">
							<p>{deal.content}</p>
						</div>
					</div>

					<div className="mt-6">
						<h3 className="text-lg font-medium text-gray-900">
							Restaurant Details
						</h3>
						<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<h4 className="text-sm font-medium text-gray-500">Name</h4>
								<p className="mt-1 text-sm text-gray-900">
									{deal.restaurant?.name}
								</p>
							</div>
							<div>
								<h4 className="text-sm font-medium text-gray-500">Address</h4>
								<p className="mt-1 text-sm text-gray-900">
									{deal.restaurant?.address}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
