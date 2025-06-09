/**
 * Utility functions for parsing restaurant IDs from various URL formats
 */

/**
 * Extracts restaurant ID from various URL formats including:
 * - https://experiencemaplegrove.app/restaurants/123
 * - /restaurants/123/scan
 * - /api/restaurants/123/scan
 * - restaurants/123
 */
export function extractRestaurantIdFromUrl(url: string): string {
  if (!url) return "";
  
  const patterns = [
    /https?:\/\/[^\/]+\/restaurants\/(\d+)(?:\/scan)?/,
    /\/api\/restaurants\/(\d+)(?:\/scan)?/,
    /\/restaurants\/(\d+)(?:\/scan)?/,
    /restaurants\/(\d+)(?:\/scan)?/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return "";
}

/**
 * Validates if a restaurant ID is a valid numeric string
 */
export function isValidRestaurantId(restaurantId: string): boolean {
  return /^\d+$/.test(restaurantId) && parseInt(restaurantId, 10) > 0;
}
