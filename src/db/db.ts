import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import * as schemaRelations from "./relations";
// import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not defined");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
// export const client = postgres(connectionString, { prepare: false });
// export const db = drizzle({ client });

export const db = drizzle({
	connection: connectionString,
	casing: "camelCase",
	schema: {
		...schema,
		...schemaRelations,
	},
});
