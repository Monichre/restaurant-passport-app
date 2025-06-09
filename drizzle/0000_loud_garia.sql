CREATE TABLE "punch_cards" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigserial NOT NULL,
	"restaurant_id" bigserial NOT NULL,
	"punches" integer DEFAULT 0,
	"completed" boolean DEFAULT false,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raffle_entries" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigserial NOT NULL,
	"punch_card_id" bigserial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurant_deals" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"restaurant_id" bigserial NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"address" text NOT NULL,
	"qr_code_url" text,
	"code" integer,
	"contact_name" varchar,
	"contact_position" varchar,
	"email" varchar,
	"phone" varchar,
	"website" varchar,
	"qr_code" varchar
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"name" text NOT NULL,
	"is_staff" boolean DEFAULT false,
	"is_admin" boolean DEFAULT false,
	"email" text NOT NULL,
	"phone" text,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_key" UNIQUE("email"),
	CONSTRAINT "users_phone_key" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "punch_cards" ADD CONSTRAINT "punch_cards_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punch_cards" ADD CONSTRAINT "punch_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raffle_entries" ADD CONSTRAINT "raffle_entries_punch_card_id_punch_cards_id_fk" FOREIGN KEY ("punch_card_id") REFERENCES "public"."punch_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raffle_entries" ADD CONSTRAINT "raffle_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_deals" ADD CONSTRAINT "restaurant_deals_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_restaurant_user_idx" ON "punch_cards" USING btree ("user_id" int8_ops,"restaurant_id" int8_ops);