/**
 * Utility functions for QR code handling
 */

import { isValidUrl } from './utils';
import { extractRestaurantIdFromUrl, isValidRestaurantId } from '@/utils/url-parsing';

/**
 * Generates the default target URL for a restaurant QR code
 * @param restaurantId The restaurant ID
 * @returns The full URL that the QR code should point to
 */
export function getRestaurantQrCodeUrl(restaurantId: string | number | bigint): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || 'https://experiencemaplegrove.app';
  
  return `${baseUrl}/restaurants/${restaurantId}`;
}

/**
 * Checks if a QR code URL is valid for a particular restaurant
 * @param url The QR code URL to validate
 * @param restaurantId The restaurant ID the QR code should be for
 * @returns boolean indicating if the URL is valid for this restaurant
 */
export function isValidQrCodeUrl(url: string | null | undefined, restaurantId?: string | number | bigint): boolean {
  if (!isValidUrl(url)) return false;
  
  // If no restaurant ID provided, just check if it's a valid URL
  if (!restaurantId) return true;
  
  try {
    const extractedId = extractRestaurantIdFromUrl(url!);
    const expectedId = restaurantId.toString();
    
    // Check if the extracted ID matches the expected restaurant ID
    return extractedId === expectedId && isValidRestaurantId(extractedId);
  } catch (e) {
    return false;
  }
}

/**
 * Validates and downloads a QR code image
 * @param url The QR code URL to download
 * @param restaurantName The restaurant name (for the download filename)
 */
export function downloadQrCode(qrCodeElement: HTMLElement | null, restaurantName: string): boolean {
  if (!qrCodeElement) return false;
  
  try {
    // Find the SVG element in the container
    const svgElement = qrCodeElement.querySelector('svg');
    if (!svgElement) {
      throw new Error('QR code SVG not found');
    }

    // Ensure white background for better visibility
    svgElement.setAttribute('style', 'background-color: white');

    // Serialize SVG to string
    const svgData = new XMLSerializer().serializeToString(svgElement);

    // Create a blob from SVG data
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${restaurantName.replace(/\s+/g, '-').toLowerCase()}-qrcode.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (err) {
    console.error('Download failed:', err);
    return false;
  }
}  