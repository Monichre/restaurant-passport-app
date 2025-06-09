/**
 * Utility functions for CSV export and handling
 */

/**
 * Convert an array of objects to CSV string
 * @param data Array of objects to convert
 * @param columns Optional array of column names to include
 * @returns CSV formatted string
 */
export function convertToCSV<T extends Record<string, unknown>>(
	data: T[],
	columns?: (keyof T)[],
): string {
	// Exit if no data
	if (!data.length) return "";

	// Determine columns to use - either provided columns or all keys from first object
	const actualColumns = columns || (Object.keys(data[0]) as (keyof T)[]);

	// Create header row
	const headerRow = actualColumns.map((key) => `"${String(key)}"`).join(",");

	// Create data rows
	const rows = data.map((item) => {
		return actualColumns
			.map((key) => {
				const value = item[key];
				// Handle different data types appropriately
				if (value === null || value === undefined) return '""';
				if (typeof value === "object")
					return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
				return `"${String(value).replace(/"/g, '""')}"`;
			})
			.join(",");
	});

	// Combine header and data rows
	return [headerRow, ...rows].join("\n");
}

/**
 * Export data as a CSV file
 * @param data Array of objects to export
 * @param filename Name of the CSV file
 * @param columns Optional array of column names to include
 */
export function exportToCSV<T extends Record<string, unknown>>(
	data: T[],
	filename: string,
	columns?: (keyof T)[],
): void {
	// Generate CSV string
	const csvContent = convertToCSV(data, columns);

	// Create blob with proper MIME type
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

	// Create download link
	const link = document.createElement("a");

	// Create file URL
	const url = URL.createObjectURL(blob);

	// Set link properties
	link.setAttribute("href", url);
	link.setAttribute("download", `${filename}.csv`);
	link.style.visibility = "hidden";

	// Add to DOM
	document.body.appendChild(link);

	// Trigger download
	link.click();

	// Clean up
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Parse and validate a CSV file
 * @param file CSV file to parse
 * @param requiredColumns Array of required column names
 * @returns Promise that resolves to parsed data if valid, or rejects with an error
 */
export async function parseCSV<T extends Record<string, unknown>>(
	file: File,
	requiredColumns: string[],
): Promise<T[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				if (!event.target?.result) {
					reject(new Error("Failed to read file"));
					return;
				}

				const csvContent = event.target.result as string;
				const lines = csvContent
					.split(/\r\n|\n/)
					.filter((line) => line.trim() !== "");

				if (lines.length < 2) {
					reject(
						new Error(
							"CSV file must contain a header row and at least one data row",
						),
					);
					return;
				}

				// Parse header row (removing quotes if present)
				const headers = lines[0]
					.split(",")
					.map((header) => header.replace(/^"(.*)"$/, "$1").trim());

				// Validate required columns
				const missingColumns = requiredColumns.filter(
					(col) => !headers.includes(col),
				);
				if (missingColumns.length > 0) {
					reject(
						new Error(`Missing required columns: ${missingColumns.join(", ")}`),
					);
					return;
				}

				// Parse data rows
				const result: T[] = [];
				for (let i = 1; i < lines.length; i++) {
					const values = parseCSVLine(lines[i]);
					if (values.length !== headers.length) {
						reject(
							new Error(
								`Line ${i + 1} has ${values.length} values but should have ${headers.length}`,
							),
						);
						return;
					}

					const row = {} as Record<string, unknown>;
					headers.forEach((header, index) => {
						row[header] = values[index];
					});

					result.push(row as T);
				}

				resolve(result);
			} catch (error) {
				reject(
					error instanceof Error
						? error
						: new Error("Failed to parse CSV file"),
				);
			}
		};

		reader.onerror = () => {
			reject(new Error("Failed to read file"));
		};

		reader.readAsText(file);
	});
}

/**
 * Parse a CSV line respecting quoted values that may contain commas
 * @param line CSV line to parse
 * @returns Array of values
 */
function parseCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			if (inQuotes && i < line.length - 1 && line[i + 1] === '"') {
				// Double quotes inside quotes - add a single quote
				current += '"';
				i++; // Skip the next quote
			} else {
				// Toggle quote mode
				inQuotes = !inQuotes;
			}
		} else if (char === "," && !inQuotes) {
			// End of value
			result.push(current.trim());
			current = "";
		} else {
			// Normal character
			current += char;
		}
	}

	// Don't forget the last value
	result.push(current.trim());

	// Remove surrounding quotes if present
	return result.map((val) => val.replace(/^"(.*)"$/, "$1"));
}
