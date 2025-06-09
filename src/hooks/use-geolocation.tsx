"use client";
import { useState, useEffect } from "react";

export const useGeolocation = () => {
	// Lazy initialize state to avoid unnecessary renders on mount
	const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Skip geolocation on server
		if (typeof window === 'undefined') return;
		
		// Don't run geolocation immediately - wait until needed or component is visible
		const handleGetLocation = () => {
			if (!navigator.geolocation) {
				setError("Geolocation not supported");
				return;
			}

			// Set loading state and clear previous errors
			setLoading(true);
			setError(null);

			// Handle timeouts better with options
			const options = {
				enableHighAccuracy: false, // Use lower accuracy for better performance
				timeout: 5000, // 5 second timeout
				maximumAge: 300000 // Cache for 5 minutes
			};

			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCoords(position.coords);
					setLoading(false);
				},
				(err) => {
					setError(err.message);
					setLoading(false);
				},
				options
			);
		};

		// Wait for user interaction or visibility before triggering geolocation
		// This improves page load performance
		const timer = setTimeout(handleGetLocation, 1000);
		
		return () => clearTimeout(timer);
	}, []);

	return { coords, error, loading };
};
