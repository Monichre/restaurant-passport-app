import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

// Function to extract restaurant information using Puppeteer
async function scrapeRestaurantInfo(url) {
	console.log(`Scraping: ${url}`);

	try {
		const browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		const page = await browser.newPage();

		// Set a timeout for navigation
		await page.setDefaultNavigationTimeout(30000);

		// Set user agent to avoid being blocked
		await page.setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		);

		// Navigate to the restaurant URL
		await page.goto(url, { waitUntil: "networkidle2" });

		// Wait for the page to load
		await page.waitForTimeout(2000);

		// Extract restaurant name, address, and image
		const data = await page.evaluate((url) => {
			// Helper function to extract text from elements
			function extractTextFromElements(selectors) {
				for (const selector of selectors) {
					try {
						const elements = document.querySelectorAll(selector);
						for (const element of elements) {
							const text = element.textContent.trim();
							if (text && text.length > 2) {
								return text;
							}
						}
					} catch {
						// Skip to next selector if this one fails
					}
				}
				return "";
			}

			// Helper to find Maple Grove addresses in text
			function findMapleGroveAddress(text) {
				if (!text) return "";

				// Find specific patterns for Maple Grove addresses
				const mapleGroveRegex =
					/\b\d+\s+(?:[A-Za-z0-9\s.,'-])+(?:Maple\s+Grove|MN|Minnesota)(?:[A-Za-z0-9\s.,'-])*\b\d{5}\b/gi;
				const matches = text.match(mapleGroveRegex);

				if (matches && matches.length > 0) {
					return matches[0].trim();
				}

				// Look for partial address patterns
				if (
					text.includes("Maple Grove") ||
					text.includes("MN 55369") ||
					text.includes("MN 55311")
				) {
					// If it contains Maple Grove and parts of an address, return it
					const lines = text
						.split("\n")
						.map((line) => line.trim())
						.filter(
							(line) =>
								line.length > 0 &&
								(line.includes("Maple Grove") ||
									/\d{5}/.test(line) || // ZIP code
									/^\d+\s+[A-Za-z]/.test(line)), // Street address starting with number
						);

					if (lines.length > 0) {
						return lines.join(", ");
					}
					return text;
				}

				return "";
			}

			// Try to find the restaurant name
			let name = "";
			const possibleNameSelectors = [
				"h1", // Most common for headers
				".restaurant-name",
				".location-name",
				".brand-name",
				".store-name",
				".site-title",
				".location h1",
				".location-title",
				"title", // Fallback to title if nothing else works
			];

			name = extractTextFromElements(possibleNameSelectors);

			// Clean up the name (remove "- Home" or other common suffixes)
			if (name) {
				name = name
					.replace(/ - .*$/, "")
					.replace(/ \| .*$/, "")
					.replace(/Home Page.*$/i, "")
					.replace(/Home$/i, "");
			}

			// Try to find the address in structured elements
			let address = "";
			const possibleAddressSelectors = [
				".address",
				".location-address",
				".restaurant-address",
				"address",
				'[itemprop="address"]',
				".store-address",
				".location-info",
				".contact-info",
				".location-detail",
			];

			address = extractTextFromElements(possibleAddressSelectors);

			// If no structured address found, try searching all text on page
			if (!address || !findMapleGroveAddress(address)) {
				// Look for paragraphs or divs containing "Maple Grove, MN"
				const textElements = [
					...document.querySelectorAll("p"),
					...document.querySelectorAll("div"),
					...document.querySelectorAll("section"),
				];

				for (const element of textElements) {
					const text = element.textContent.trim();
					const mapleGroveAddress = findMapleGroveAddress(text);
					if (mapleGroveAddress) {
						address = mapleGroveAddress;
						break;
					}
				}
			}

			// Try to find an image (logo or restaurant image)
			let imageUrl = "";
			const possibleImageSelectors = [
				".restaurant-image img",
				".location-image img",
				".hero-image img",
				".main-image img",
				".brand-logo",
				".logo img",
				"header img",
				// Main content images
				".main-content img",
				".location img",
				// Get any large image from the page
				'img[width="100"]',
				'img[width="200"]',
				'img[width="300"]',
				'img[width="400"]',
				'img[width="500"]',
				'img[src*="logo"]',
				'img[src*="restaurant"]',
				'img:not([src*="icon"])',
			];

			for (const selector of possibleImageSelectors) {
				const elements = document.querySelectorAll(selector);
				for (const element of elements) {
					// Ignore tiny images
					if (element.width > 100 || element.height > 100) {
						const src = element.src || element.getAttribute("data-src");
						if (
							src &&
							!src.includes("blank.gif") &&
							!src.includes("placeholder")
						) {
							imageUrl = src;
							break;
						}
					}
				}

				if (imageUrl) break;
			}

			// Convert relative URLs to absolute
			if (imageUrl && !imageUrl.startsWith("http")) {
				const baseUrl = new URL(url);
				imageUrl = new URL(imageUrl, baseUrl.origin).href;
			}

			// Extract restaurant name from URL as a fallback if no name found
			if (!name) {
				try {
					const urlObj = new URL(url);
					const domain = urlObj.hostname.replace("www.", "");
					// Convert domain to readable name (e.g. pizza-hut.com -> Pizza Hut)
					name = domain
						.split(".")[0] // Get the first part of the domain
						.split("-")
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(" ");
				} catch (e) {
					// If URL parsing fails, use a generic name
					name = "Restaurant";
				}
			}

			return {
				name,
				address,
				imageUrl,
				sourceUrl: url,
			};
		}, url);

		await browser.close();
		return data;
	} catch (error) {
		console.error(`Error scraping ${url}:`, error.message);
		return {
			name: "",
			address: "",
			imageUrl: "",
			sourceUrl: url,
			error: error.message,
		};
	}
}

// Main function to run the scraper
async function main() {
	try {
		// Read the JSON file with restaurant URLs
		const restaurantsData = JSON.parse(
			readFileSync("scripts/restaurants.json", "utf8"),
		);
		const urls = restaurantsData.restaurants;

		// Limit number of concurrent browser instances
		const concurrencyLimit = 5;
		const results = [];

		// Process URLs in batches to avoid overwhelming system resources
		for (let i = 0; i < urls.length; i += concurrencyLimit) {
			const batch = urls.slice(i, i + concurrencyLimit);
			const batchNumber = Math.floor(i / concurrencyLimit) + 1;
			const totalBatches = Math.ceil(urls.length / concurrencyLimit);
			console.log(`Processing batch ${batchNumber} of ${totalBatches}`);

			const batchPromises = batch.map((url) => scrapeRestaurantInfo(url));
			const batchResults = await Promise.all(batchPromises);

			results.push(...batchResults);

			// Quick progress report
			console.log(
				`Completed ${Math.min(i + concurrencyLimit, urls.length)} of ${urls.length} URLs`,
			);
		}

		// Filter out incomplete results
		const validResults = results.filter(
			(result) => result.name && (result.address || result.imageUrl),
		);

		// Save the results to a new JSON file
		const outputData = {
			scrapedAt: new Date().toISOString(),
			totalScraped: results.length,
			validResults: validResults.length,
			restaurants: validResults,
		};

		writeFileSync(
			"restaurant-data.json",
			JSON.stringify(outputData, null, 2),
			"utf8",
		);

		console.log(
			`Scraping completed. Found data for ${validResults.length} out of ${urls.length} restaurants.`,
		);
		console.log("Results saved to restaurant-data.json");
	} catch (error) {
		console.error("An error occurred during scraping:", error);
	}
}

main();
