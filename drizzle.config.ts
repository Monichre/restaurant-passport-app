// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
export default defineConfig({
	schema: "./src/db/drizzle/schema.ts", // Where the generated schema will be written

	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
	// Simplify introspection to avoid constraint issues
	introspect: {
		casing: "camel", // Keep the original casing from the database
	},
});
