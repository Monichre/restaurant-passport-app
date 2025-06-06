/**
 * Utility functions for handling restaurant QR codes
 */

/**
 * Generates the default target URL for a restaurant QR code
 * @param restaurantId The restaurant ID
 * @returns The full URL that the QR code should point to
 */
export function getRestaurantQrCodeUrl(restaurantId: string | number | bigint): string {
	const baseUrl = typeof window !== 'undefined' 
		? window.location.origin 
		: process.env.NEXT_PUBLIC_APP_URL || '';
	
	return `${baseUrl}/api/restaurants/${restaurantId}/scan`;
}

// Generate QR code SVG data URL
export const generateQRCodeDataUrl = (qrCodeValue: string) => {
	// Create SVG QR code (simplified example)
	const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" style="background-color: white">
      <rect width="200" height="200" fill="white" />
      <path d="M0,0 L200,0 L200,200 L0,200 Z" fill="white" />
      <path d="M40,40 L50,40 L50,50 L40,50 Z M60,40 L70,40 L70,50 L60,50 Z M80,40 L90,40 L90,50 L80,50 Z M100,40 L110,40 L110,50 L100,50 Z M120,40 L130,40 L130,50 L120,50 Z M140,40 L150,40 L150,50 L140,50 Z M160,40 L170,40 L170,50 L160,50 Z" fill="black" />
      <!-- QR code pattern for ${qrCodeValue} -->
    </svg>`;

	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};
