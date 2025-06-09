"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createRestaurantAction } from "@/app/admin/restaurants/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRestaurantSchema } from "@/types/schemas";
import Image from "next/image";

type FormData = z.infer<typeof createRestaurantSchema>;

export function RestaurantForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
		imageUrl: "",
		address: "",
	});
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
		{},
	);

	// File upload state
	const [isDragging, setIsDragging] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error for this field when user types
		if (errors[name as keyof FormData]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	// Process the selected file
	const processFile = useCallback((file: File) => {
		// Validate file type
		if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
			setUploadError("Please upload a valid image file (JPEG, PNG, or WebP)");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			setUploadError("Image size should be less than 5MB");
			return;
		}

		setImageFile(file);
		setUploadError(null);

		// Set the image preview
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			setImagePreview(result);
			// Set the imageUrl to the preview for validation
			setFormData((prev) => ({
				...prev,
				imageUrl: result,
			}));
		};
		reader.readAsDataURL(file);
	}, []);

	// Handle file selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			processFile(file);
		}
	};

	// Drag and drop handlers
	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (!isDragging) {
				setIsDragging(true);
			}
		},
		[isDragging],
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				const file = e.dataTransfer.files[0];
				processFile(file);
			}
		},
		[processFile],
	);

	// Open file dialog when clicking on the upload area
	const openFileDialog = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Function to handle file upload
	const uploadImageToServer = async (file: File): Promise<string> => {
		// In a real implementation, you would upload the file to your server or a service like S3
		// For now, we'll just return the data URL
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.readAsDataURL(file);
		});
	};

	const validateForm = (): boolean => {
		try {
			createRestaurantSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Partial<Record<keyof FormData, string>> = {};
				for (const err of error.errors) {
					const path = err.path[0] as keyof FormData;
					newErrors[path] = err.message;
				}
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Upload image file if selected
		if (imageFile) {
			try {
				const imageUrl = await uploadImageToServer(imageFile);
				// Update formData with the uploaded image URL
				setFormData((prev) => ({
					...prev,
					imageUrl,
				}));
			} catch (error) {
				console.error("Error uploading image:", error);
				setUploadError("Failed to upload image. Please try again.");
				return;
			}
		}

		if (!validateForm()) return;

		setIsSubmitting(true);

		try {
			const result = await createRestaurantAction(formData);

			if (result.success) {
				router.push("/admin/restaurants");
				router.refresh();
			} else {
				console.error("Error creating restaurant:", result.error);
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("Error creating restaurant:", error);
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Restaurant Name
					</label>
					<Input
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className={errors.name ? "border-red-500" : ""}
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-600">{errors.name}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows={4}
						value={formData.description}
						onChange={handleChange}
						className={`w-full rounded-md border ${
							errors.description ? "border-red-500" : "border-input"
						} bg-transparent px-3 py-2 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
					/>
					{errors.description && (
						<p className="mt-1 text-sm text-red-600">{errors.description}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="imageUpload"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Restaurant Image
					</label>
					<button
						type="button"
						className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
							isDragging
								? "border-blue-500 bg-blue-50"
								: errors.imageUrl
									? "border-red-300"
									: "border-gray-300 hover:border-gray-400"
						}`}
						onDragEnter={handleDragEnter}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={openFileDialog}
						aria-label="Click or drop an image to upload"
					>
						<input
							ref={fileInputRef}
							type="file"
							id="imageUpload"
							accept="image/jpeg,image/png,image/webp"
							className="hidden"
							onChange={handleFileChange}
						/>

						{imagePreview ? (
							<div className="relative w-full h-48 mx-auto mb-2">
								<Image
									src={imagePreview}
									alt="Restaurant preview"
									className="rounded-md object-cover"
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>
						) : (
							<div className="py-8">
								<svg
									className="mx-auto h-12 w-12 text-gray-400"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 48 48"
									aria-hidden="true"
								>
									<path
										d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<p className="mt-2 text-sm text-gray-500">
									Drag and drop an image here, or click to select a file
								</p>
								<p className="mt-1 text-xs text-gray-400">
									PNG, JPG, or WebP (max 5MB)
								</p>
							</div>
						)}
					</button>
					{uploadError && (
						<p className="mt-1 text-sm text-red-600">{uploadError}</p>
					)}
					{errors.imageUrl && !uploadError && (
						<p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="address"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Address
					</label>
					<Input
						id="address"
						name="address"
						value={formData.address}
						onChange={handleChange}
						className={errors.address ? "border-red-500" : ""}
					/>
					{errors.address && (
						<p className="mt-1 text-sm text-red-600">{errors.address}</p>
					)}
				</div>
			</div>

			<div className="flex justify-end space-x-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push("/admin/restaurants")}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creating..." : "Create Restaurant"}
				</Button>
			</div>
		</form>
	);
}
