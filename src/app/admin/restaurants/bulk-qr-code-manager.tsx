"use client";

import { useState, useRef, useEffect } from "react";
import { useHandleQRCode } from "@/hooks/use-handle-qr-code";
import type { Restaurant } from "@/types/db";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
	DialogHeader,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertCircle,
	CheckCircle2,
	Download,
	QrCode,
	RefreshCw,
	Save,
	X,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface BulkQRCodeManagerProps {
	restaurants: Restaurant[];
}

export function BulkQRCodeManager({ restaurants }: BulkQRCodeManagerProps) {
	const [open, setOpen] = useState(false);
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

	const allSelected =
		restaurants.length > 0 && selectedRestaurants.length === restaurants.length;
	const someSelected =
		selectedRestaurants.length > 0 &&
		selectedRestaurants.length < restaurants.length;

	const restaurantsWithoutQR = restaurants.filter((r) => !r.qrCodeUrl);
	const hasRestaurantsWithoutQR = restaurantsWithoutQR.length > 0;

	// Add ref for checkbox to handle indeterminate state properly
	const checkboxRef = useRef<HTMLButtonElement>(null);

	// Apply indeterminate state via DOM API when needed
	useEffect(() => {
		// Access the DOM element through ref.current
		if (checkboxRef.current && someSelected) {
			// Use HTMLInputElement as it has the indeterminate property
			const element = checkboxRef.current as unknown as HTMLInputElement;
			// Set indeterminate state
			element.indeterminate = true;
		}
	}, [someSelected]);

	// Handle dialog close - reset state if needed
	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && !generating && !saving) {
			handleReset();
		}
		setOpen(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className="ml-auto flex items-center gap-2">
					<QrCode className="h-4 w-4" />
					<span>Bulk QR Code Manager</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-3xl p-6">
				<DialogHeader>
					<DialogTitle>Bulk QR Code Manager</DialogTitle>
					<DialogDescription>
						Generate, save, and download QR codes for multiple restaurants at
						once
					</DialogDescription>
				</DialogHeader>

				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{success && (
					<Alert className="mb-4 bg-green-50 border-green-200 text-green-700">
						<CheckCircle2 className="h-4 w-4" />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>
							QR codes have been saved successfully!
						</AlertDescription>
					</Alert>
				)}

				{hasRestaurantsWithoutQR && !generating && !success && (
					<Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-700">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Notice</AlertTitle>
						<AlertDescription>
							{restaurantsWithoutQR.length} restaurant
							{restaurantsWithoutQR.length > 1 ? "s" : ""}{" "}
							{restaurantsWithoutQR.length > 1 ? "do" : "does"} not have QR
							codes. They will be created during the bulk operation.
						</AlertDescription>
					</Alert>
				)}

				{generating && progress > 0 && (
					<div className="mb-4 space-y-2">
						<div className="flex justify-between text-sm text-gray-500">
							<span>Generating QR codes...</span>
							<span>{progress}%</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>
				)}

				<div className="mb-4 flex items-center">
					<Checkbox
						id="select-all"
						ref={checkboxRef}
						checked={allSelected}
						onCheckedChange={(checked) =>
							toggleSelectAll(restaurants, checked === true)
						}
						disabled={generating || saving}
						className="mr-2"
					/>
					<label htmlFor="select-all" className="text-sm font-medium">
						{allSelected ? "Deselect all" : "Select all"} ({restaurants.length})
					</label>

					<div className="ml-auto space-x-2">
						{!generating && !success && (
							<Button
								onClick={() => handleGenerateAll()}
								disabled={selectedRestaurants.length === 0 || generating}
								className="text-xs h-8"
							>
								<QrCode className="h-3.5 w-3.5 mr-1" />
								Generate QR Codes
							</Button>
						)}

						{generating && !success && (
							<Button
								onClick={handleSaveAll}
								disabled={results.length === 0 || saving}
								className="text-xs h-8"
							>
								<Save className="h-3.5 w-3.5 mr-1" />
								{saving ? "Saving..." : "Save QR Codes"}
							</Button>
						)}

						{success && (
							<>
								<Button
									onClick={handleDownloadAll}
									variant="secondary"
									className="text-xs h-8"
								>
									<Download className="h-3.5 w-3.5 mr-1" />
									Download All
								</Button>

								<Button
									onClick={handleReset}
									variant="outline"
									className="text-xs h-8"
								>
									<RefreshCw className="h-3.5 w-3.5 mr-1" />
									Start New Batch
								</Button>
							</>
						)}
					</div>
				</div>

				<div className="rounded border max-h-[400px] overflow-y-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-10" />
								<TableHead>Restaurant</TableHead>
								<TableHead>Current Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{restaurants.map((restaurant) => {
								const isSelected = selectedRestaurants.some(
									(r) => r.id === restaurant.id,
								);
								const resultItem = results.find(
									(r) => r.restaurantId === restaurant.id.toString(),
								);

								return (
									<TableRow key={restaurant.id.toString()}>
										<TableCell className="p-2">
											<Checkbox
												checked={isSelected}
												onCheckedChange={(value) =>
													toggleRestaurant(restaurant)
												}
												disabled={generating || saving}
											/>
										</TableCell>
										<TableCell className="py-2">
											<div className="font-medium">{restaurant.name}</div>
											<div className="text-xs text-gray-500 truncate max-w-[300px]">
												{restaurant.address}
											</div>
										</TableCell>
										<TableCell className="py-2">
											{resultItem ? (
												<div className="flex items-center">
													{resultItem.success ? (
														<>
															<CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
															<span className="text-sm">Success</span>
														</>
													) : (
														<>
															<X className="h-4 w-4 text-red-500 mr-2" />
															<span className="text-sm">Failed</span>
														</>
													)}
												</div>
											) : (
												<div className="flex items-center">
													{restaurant.qrCodeUrl ? (
														<div className="flex items-center gap-2">
															<div className="relative w-8 h-8 shrink-0">
																<Image
																	src={restaurant.qrCodeUrl}
																	alt="QR"
																	fill
																	className="object-contain"
																	sizes="32px"
																/>
															</div>
															<span className="text-xs">Exists</span>
														</div>
													) : (
														<span className="text-xs text-gray-500">
															No QR code
														</span>
													)}
												</div>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>

				<DialogFooter className="mt-4">
					{!generating && !success && (
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
					)}

					{generating && !success && (
						<Button variant="outline" onClick={handleReset} disabled={saving}>
							<X className="h-4 w-4 mr-1" />
							Cancel
						</Button>
					)}

					{success && (
						<Button variant="outline" onClick={() => setOpen(false)}>
							Close
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
