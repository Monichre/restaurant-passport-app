import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import { readFileSync, writeFileSync } from "node:fs";

// Define the schema for restaurant data extraction
const restaurantSchema = z
	.object({
		name: z.string().describe("The full name of the restaurant"),
		address: z
			.string()
			.optional()
			.describe("The full address of the restaurant in Maple Grove, Minnesota"),
		imageUrl: z
			.string()
			.optional()
			.describe("URL of the restaurant's logo or main image"),
	})
	.describe("Extract restaurant details from the webpage");

/**
 * Extract restaurant data using Firecrawl
 * @param {string} url - The URL of the restaurant website
 * @param {string} apiKey - Firecrawl API key
 * @returns {Promise<Object>} - Restaurant data
 */
export async function extractWithFirecrawl(url) {
	try {
		console.log(`Extracting data from ${url} using Firecrawl...`);

		const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

		// Use Firecrawl's LLM extraction to extract structured data
		const scrapeResult = await app.scrapeUrl(url, {
			jsonOptions: {
				extractionSchema: restaurantSchema,
			},
		});

		if (!scrapeResult.success) {
			throw new Error(
				`Firecrawl extraction failed: ${scrapeResult.error || "Unknown error"}`,
			);
		}

		// Get the extracted JSON data
		const extractedData = scrapeResult.data?.json;

		// Return processed data in the format expected by the main scraper
		return {
			name: extractedData?.name || "",
			address: extractedData?.address || "",
			imageUrl: extractedData?.imageUrl || "",
			sourceUrl: url,
			extractionMethod: "firecrawl",
		};
	} catch (error) {
		console.error(`Error using Firecrawl on ${url}:`, error.message);
		return {
			name: "",
			address: "",
			imageUrl: "",
			sourceUrl: url,
			error: error.message,
			extractionMethod: "firecrawl-failed",
		};
	}
}

/**
 * Batch process URLs with Firecrawl
 * @param {string[]} urls - Array of restaurant URLs
 * @param {string} apiKey - Firecrawl API key
 * @param {number} concurrencyLimit - Max number of concurrent requests
 * @returns {Promise<Object[]>} - Array of restaurant data objects
 */
export async function batchExtractWithFirecrawl(
	urls,
	apiKey,
	concurrencyLimit = 5,
) {
	const results = [];

	// Process URLs in batches to avoid overwhelming API limits
	for (let i = 0; i < urls.length; i += concurrencyLimit) {
		const batch = urls.slice(i, i + concurrencyLimit);
		const batchNumber = Math.floor(i / concurrencyLimit) + 1;
		const totalBatches = Math.ceil(urls.length / concurrencyLimit);

		console.log(
			`Processing batch ${batchNumber} of ${totalBatches} with Firecrawl`,
		);

		const batchPromises = batch.map((url) => extractWithFirecrawl(url, apiKey));
		const batchResults = await Promise.all(batchPromises);

		results.push(...batchResults);

		console.log(
			`Completed ${Math.min(i + concurrencyLimit, urls.length)} of ${urls.length} URLs with Firecrawl`,
		);
	}

	return results;
}

// Only execute this if run directly (not imported)
if (import.meta.url === import.meta.main) {
	// Read API key from environment or config
	const apiKey = process.env.FIRECRAWL_API_KEY;

	if (!apiKey) {
		console.error("Error: FIRECRAWL_API_KEY environment variable is not set");
		process.exit(1);
	}

	try {
		// Read restaurant URLs
		const restaurantsData = JSON.parse(
			readFileSync("scripts/restaurants.json", "utf8"),
		);
		const urls = restaurantsData.restaurants;

		// Process URLs with Firecrawl
		const results = await batchExtractWithFirecrawl(urls, apiKey);

		// Filter out failed extractions
		const validResults = results.filter(
			(result) => result.name && (result.address || result.imageUrl),
		);

		// Save the results
		const outputData = {
			scrapedAt: new Date().toISOString(),
			totalScraped: results.length,
			validResults: validResults.length,
			extractionMethod: "firecrawl",
			restaurants: validResults,
		};

		writeFileSync(
			"firecrawl-restaurant-data.json",
			JSON.stringify(outputData, null, 2),
			"utf8",
		);

		console.log(
			`Firecrawl extraction completed. Found data for ${validResults.length} out of ${urls.length} restaurants.`,
		);
		console.log("Results saved to firecrawl-restaurant-data.json");
	} catch (error) {
		console.error("An error occurred during extraction:", error);
	}
}
