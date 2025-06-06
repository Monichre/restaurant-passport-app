"use client";

import { saveQRCodeUrl } from "@/app/admin/restaurants/actions";
import type { Restaurant } from "@/types/db";
import { useRef, useState, useCallback, useEffect } from "react";

export const useHandleQRCode = ({ restaurant }: { restaurant: Restaurant }) => {
	const [generating, setGenerating] = useState(false);
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(restaurant.qrCodeUrl || null);
	const [qrCodeValue, setQrCodeValue] = useState<string>(`https://experiencemaplegrove.app/restaurants/${restaurant.id}`);	
	const qrRef = useRef<HTMLDivElement>(null);

	// Generate QR code and show save/cancel buttons
	const handleGenerate = useCallback(() => {
		// Simple QR code value without timestamp
		const newQrCodeValue = `https://experiencemaplegrove.app/restaurants/${restaurant.id}`;
		
		setQrCodeValue(newQrCodeValue);
		setGenerating(true);
		setError(null);
		setSuccess(false);
		setQrCodeDataUrl(null); // Clear previous data URL when generating new
	}, [restaurant.id]);

	// Cancel QR code generation
	const handleCancel = useCallback(() => {
		setGenerating(false);
		setError(null);
		// Reset to original QR code value if exists
		setQrCodeValue(`https://experiencemaplegrove.app/restaurants/${restaurant.id}`);
	}, [restaurant.id]);

	// Download QR code as image with browser compatibility handling
	const handleDownload = useCallback(() => {
		if (!qrCodeDataUrl && !qrRef.current) {
			setError("No QR code found to download");
			return;
		}

		try {
			// If we already have a data URL, use it
			let dataUrl = qrCodeDataUrl;

			// Otherwise, try to generate one from the current SVG
			if (!dataUrl && qrRef.current) {
				const svgElement = qrRef.current.querySelector("svg");
				if (!svgElement) {
					throw new Error("QR code SVG not found");
				}

				// Clone the SVG to avoid modifying the original
				const clonedSvg = svgElement.cloneNode(true) as SVGElement;

				// Set attributes that might be needed for better compatibility
				clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
				if (!clonedSvg.hasAttribute("width")) {
					clonedSvg.setAttribute("width", "200");
				}
				if (!clonedSvg.hasAttribute("height")) {
					clonedSvg.setAttribute("height", "200");
				}

				// Ensure background is white for better visibility
				clonedSvg.setAttribute("style", "background-color: white");

				// Serialize the SVG with proper XML declaration
				const svgData = new XMLSerializer().serializeToString(clonedSvg);
				const encodedData = encodeURIComponent(svgData);
				dataUrl = `data:image/svg+xml;charset=utf-8,${encodedData}`;
			}

			if (!dataUrl) {
				throw new Error("Failed to generate QR code data URL");
			}

			// Handle download with fallbacks for different browsers
			const isSafari = /^((?!chrome|android).)*safari/i.test(
				navigator.userAgent,
			);
			const filename = `${restaurant.name.replace(/\s+/g, "-").toLowerCase()}-qrcode.svg`;

			if (isSafari) {
				// Safari doesn't handle the download attribute well, open in new tab
				const newTab = window.open();
				if (newTab) {
					newTab.document.write(`
						<html>
							<head>
								<title>Download QR Code</title>
								<style>
									body { 
										display: flex; 
										flex-direction: column; 
										align-items: center; 
										justify-content: center; 
										height: 100vh; 
										font-family: system-ui, sans-serif;
									}
									.instructions {
										margin: 20px;
										max-width: 400px;
										text-align: center;
									}
								</style>
							</head>
							<body>
								<img src="${dataUrl}" alt="QR Code" width="300" height="300" />
								<div class="instructions">
									<p>Right-click or long-press the image and select "Save Image As" to download.</p>
									<p>Filename: ${filename}</p>
								</div>
							</body>
						</html>
					`);
					newTab.document.close();
				} else {
					throw new Error(
						"Could not open download window. Please check your popup blocker settings.",
					);
				}
			} else {
				// For other browsers, use the standard approach
				const link = document.createElement("a");
				link.href = dataUrl;
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		} catch (err) {
			console.error("Download failed:", err);
			setError(
				err instanceof Error ? err.message : "Failed to download QR code",
			);
		}
	}, [qrCodeDataUrl, restaurant.name]);

	// Save QR code URL to database with improved error handling
	const handleSave = useCallback(async () => {
		setSaving(true);
		setError(null);
		try {
			// Make sure we have a valid QR code to save
			if (!qrRef.current) {
				throw new Error("QR code container not found");
			}

			// Convert QR code to data URL
			const svgElement = qrRef.current.querySelector("svg");
			if (!svgElement) {
				throw new Error("QR code SVG not found");
			}

			// Clone and prepare SVG for saving
			const clonedSvg = svgElement.cloneNode(true) as SVGElement;
			clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

			// Ensure dimensions are set
			if (!clonedSvg.hasAttribute("width")) {
				clonedSvg.setAttribute("width", "200");
			}
			if (!clonedSvg.hasAttribute("height")) {
				clonedSvg.setAttribute("height", "200");
			}

			// Add white background
			clonedSvg.setAttribute("style", "background-color: white");

			const svgData = new XMLSerializer().serializeToString(clonedSvg);

			// Use safe encoding for all browsers
			let dataUrl: string;
			try {
				// Modern approach - safer for all characters
				const blob = new Blob([svgData], { type: "image/svg+xml" });
				dataUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});
			} catch (blobError) {
				// Fallback to base64 encoding
				console.warn(
					"Blob approach failed, falling back to base64:",
					blobError,
				);
				dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
			}

			// Save to database
			const result = await saveQRCodeUrl(restaurant.id.toString(), dataUrl);

			if (result && result.success) {
				setSuccess(true);
				setGenerating(false);
				setQrCodeDataUrl(dataUrl);
			} else {
				throw new Error(result?.error || "Failed to save QR code");
			}
		} catch (err) {
			console.error("Save error:", err);
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while saving the QR code",
			);
		} finally {
			setSaving(false);
		}
	}, [restaurant.id]);

	// Set the initial QR code value when the component mounts
	useEffect(() => {
		if (restaurant?.id) {
			setQrCodeValue(`https://experiencemaplegrove.app/restaurants/${restaurant.id}`);
		}
	}, [restaurant?.id]);

	return {
		qrCodeDataUrl,
		qrCodeValue,
		handleGenerate,
		handleCancel,
		handleDownload,
		handleSave,
		generating,
		saving,
		success,
		error,
		qrRef,
	};
};
