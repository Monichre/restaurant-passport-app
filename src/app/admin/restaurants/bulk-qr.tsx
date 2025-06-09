"use client";

import { useState, useEffect } from "react";
import { useHandleQRCode } from "@/hooks/use-handle-qr-code";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
	Check,
	X,
	QrCode,
	RefreshCw,
	Download,
	Save,
	ChevronLeft,
} from "lucide-react";

// Import types and fetch function
import type { Restaurant } from "@/types/db";

export function BulkQRPage({ restaurants }: { restaurants: Restaurant[] }) {
	const {
		selectedRestaurants = [],
		generating,
		saving,
		success,
		error,
		progress = 0,
		results = [],
		toggleSelectAll = () => {},
		toggleRestaurant = () => {},
		handleGenerateAll = async () => {},
		handleSaveAll = async () => {},
		handleDownloadAll = async () => {},
		handleReset = () => {},
	} = useHandleQRCode({ restaurants, mode: "bulk" });

	const [isClient, setIsClient] = useState(false);

	// Set client-side flag to avoid hydration issues
	useEffect(() => {
		setIsClient(true);
	}, []);

	const allSelected =
		restaurants.length > 0 && selectedRestaurants.length === restaurants.length;
	const someSelected =
		selectedRestaurants.length > 0 &&
		selectedRestaurants.length < restaurants.length;

	if (!isClient) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container py-8 space-y-6">
			<div className="flex items-center">
				<Link
					href="/admin/restaurants"
					className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mr-4"
				>
					<ChevronLeft className="h-4 w-4 mr-1" />
					Back to Restaurants
				</Link>
				<h1 className="text-2xl font-bold">Bulk QR Code Generator</h1>
			</div>

			<div className="bg-white border rounded-lg p-6 shadow-sm">
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-2">Select Restaurants</h2>
					<p className="text-gray-500">
						Choose the restaurants you want to generate QR codes for. You can
						select all restaurants or pick specific ones from the list.
					</p>
				</div>

				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
						<div className="flex items-center">
							<X className="h-5 w-5 mr-2 text-red-500" />
							<p>{error}</p>
						</div>
					</div>
				)}

				{success && (
					<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
						<div className="flex items-center">
							<Check className="h-5 w-5 mr-2 text-green-500" />
							<p>
								QR codes have been generated successfully for{" "}
								{results.filter((r) => r.success).length} restaurants!
							</p>
						</div>
					</div>
				)}

				{/* Selection controls */}
				<div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-md">
					<div className="flex items-center">
						<Checkbox
							id="select-all"
							checked={allSelected}
							onCheckedChange={(checked) =>
								toggleSelectAll(restaurants, checked === true)
							}
							disabled={generating || saving}
							className="mr-2"
						/>
						<label htmlFor="select-all" className="text-sm font-medium">
							{allSelected ? "Deselect All" : "Select All"} (
							{restaurants.length} restaurants)
						</label>
					</div>

					<div className="space-x-2">
						{!generating && !success && (
							<Button
								onClick={() => handleGenerateAll()}
								disabled={selectedRestaurants.length === 0 || generating}
							>
								<QrCode className="h-4 w-4 mr-2" />
								Generate QR Codes
							</Button>
						)}

						{generating && !success && (
							<Button
								onClick={handleSaveAll}
								disabled={results.length === 0 || saving}
							>
								<Save className="h-4 w-4 mr-2" />
								{saving ? "Saving..." : "Save QR Codes"}
							</Button>
						)}

						{success && (
							<>
								<Button onClick={handleDownloadAll} variant="outline">
									<Download className="h-4 w-4 mr-2" />
									Download All
								</Button>
								<Button onClick={handleReset} variant="outline">
									<RefreshCw className="h-4 w-4 mr-2" />
									Generate New Batch
								</Button>
							</>
						)}
					</div>
				</div>

				{/* Progress indicator */}
				{generating && progress > 0 && (
					<div className="mb-6 space-y-2">
						<div className="flex justify-between text-sm text-gray-500">
							<span>Generating QR codes...</span>
							<span>{progress}%</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>
				)}

				{/* Restaurant list */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{restaurants.map((restaurant) => {
						const isSelected = selectedRestaurants.some(
							(r) => r.id === restaurant.id,
						);
						const resultItem = results.find(
							(r) => r.restaurantId === restaurant.id.toString(),
						);

						return (
							<div
								key={restaurant.id.toString()}
								className={`border rounded-lg p-4 ${isSelected ? "bg-blue-50 border-blue-200" : ""}`}
							>
								<div className="flex items-start">
									<div className="flex items-center h-5 mt-1">
										<Checkbox
											checked={isSelected}
											onCheckedChange={(checked) =>
												toggleRestaurant(restaurant)
											}
											disabled={generating || saving}
											aria-label={`Select ${restaurant.name}`}
										/>
									</div>
									<div className="ml-3 flex-1">
										<h3 className="text-base font-semibold">
											{restaurant.name}
										</h3>
										<p className="text-sm text-gray-500 line-clamp-2">
											{restaurant.address}
										</p>

										{/* QR Code Status */}
										<div className="mt-2">
											{resultItem ? (
												resultItem.success ? (
													<Badge className="bg-green-100 text-green-800 border-green-200">
														<Check className="h-3 w-3 mr-1" />
														Generated
													</Badge>
												) : (
													<Badge
														variant="destructive"
														className="bg-red-100 text-red-800 border-red-200"
													>
														<X className="h-3 w-3 mr-1" />
														Failed
													</Badge>
												)
											) : (
												<div className="flex items-center text-sm text-gray-500">
													{restaurant.qrCodeUrl ? (
														<div className="flex items-center gap-2">
															<div className="relative w-8 h-8">
																<Image
																	src={restaurant.qrCodeUrl}
																	alt={`QR code for ${restaurant.name}`}
																	fill
																	className="object-contain"
																	sizes="32px"
																/>
															</div>
															<span className="text-xs">Has QR Code</span>
														</div>
													) : (
														<span className="text-xs">No QR Code</span>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
