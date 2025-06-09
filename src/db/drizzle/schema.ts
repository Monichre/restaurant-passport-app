import {
	pgTable,
	unique,
	bigserial,
	text,
	boolean,
	integer,
	varchar,
	uniqueIndex,
	foreignKey,
	timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
	"users",
	{
		id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
		clerkId: text("clerk_id").notNull(),
		name: text().notNull(),
		isStaff: boolean("is_staff").default(false),
		isAdmin: boolean("is_admin").default(false),
		email: text().notNull(),
		phone: text(),
	},
	(table) => [
		unique("users_clerk_id_unique").on(table.clerkId),
		unique("users_email_key").on(table.email),
		unique("users_phone_key").on(table.phone),
	],
);

export const restaurants = pgTable("restaurants", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	imageUrl: text("image_url").notNull(),
	address: text().notNull(),
	qrCodeUrl: text("qr_code_url"),
	code: integer(),
	contactName: varchar("contact_name"),
	contactPosition: varchar("contact_position"),
	email: varchar(),
	phone: varchar(),
	website: varchar(),
	qrCodeSvg: varchar("qr_code_svg"),
});

export const punchCards = pgTable(
	"punch_cards",
	{
		id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
		userId: bigserial("user_id", { mode: "bigint" }).notNull(),
		restaurantId: bigserial("restaurant_id", { mode: "bigint" }).notNull(),
		punches: integer().default(0),
		completed: boolean().default(false),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
	},
	(table) => [
		uniqueIndex("unique_restaurant_user_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("int8_ops"),
			table.restaurantId.asc().nullsLast().op("int8_ops"),
		),
		foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "punch_cards_restaurant_id_restaurants_id_fk",
		}),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "punch_cards_user_id_users_id_fk",
		}),
	],
);

export const restaurantDeals = pgTable(
	"restaurant_deals",
	{
		id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
		restaurantId: bigserial("restaurant_id", { mode: "bigint" }).notNull(),
		title: text().notNull(),
		content: text().notNull(),
		active: boolean().default(true),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "restaurant_deals_restaurant_id_restaurants_id_fk",
		}),
	],
);

export const raffleEntries = pgTable(
	"raffle_entries",
	{
		id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
		userId: bigserial("user_id", { mode: "bigint" }).notNull(),
		punchCardId: bigserial("punch_card_id", { mode: "bigint" }).notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
	},
	(table) => [
		foreignKey({
			columns: [table.punchCardId],
			foreignColumns: [punchCards.id],
			name: "raffle_entries_punch_card_id_punch_cards_id_fk",
		}),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "raffle_entries_user_id_users_id_fk",
		}),
	],
);
