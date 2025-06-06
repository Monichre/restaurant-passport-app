/* src/lib/svg-to-data-url.ts */

/**
 * Converts a QR code SVG string to a data URL.
 * Handles both server-side (Node.js) and client-side conversion.
 * 
 * @param svg - The QR code SVG content as a string
 * @returns A data URL representing the SVG image
 */
export const svgToDataURL = (svg: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: use Node's Buffer for base64 encoding
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  } else {
    // Client-side: use btoa after proper encoding
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }
}; 