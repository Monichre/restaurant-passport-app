

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."raffle_entries" (
    "id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "punch_card_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."raffle_entries" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."UserEntersRaffle"("p_user_id" bigint) RETURNS "public"."raffle_entries"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    entry public.raffle_entries;
BEGIN
    INSERT INTO public.raffle_entries (user_id)
    VALUES (p_user_id)
    RETURNING * INTO entry;         -- give caller the whole row

    RETURN entry;
END;
$$;


ALTER FUNCTION "public"."UserEntersRaffle"("p_user_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."punch_card_after_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    total_cards BIGINT;
BEGIN
    /* How many punch-card rows does this user have *after* the insert? */
    SELECT COUNT(*)
    INTO   total_cards
    FROM   public.punch_cards
    WHERE  user_id = NEW.user_id;

    /* Grant a raffle entry ONLY on every sixth card (6, 12, 18, …) */
    IF (total_cards % 6) = 0 THEN
        PERFORM public."UserEntersRaffle"(NEW.user_id);
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."punch_card_after_insert"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."punch_cards" (
    "id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "restaurant_id" bigint NOT NULL,
    "punches" integer DEFAULT 0,
    "completed" boolean DEFAULT false,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."punch_cards" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."punch_cards_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."punch_cards_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."punch_cards_id_seq" OWNED BY "public"."punch_cards"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."punch_cards_restaurant_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."punch_cards_restaurant_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."punch_cards_restaurant_id_seq" OWNED BY "public"."punch_cards"."restaurant_id";



CREATE SEQUENCE IF NOT EXISTS "public"."punch_cards_user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."punch_cards_user_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."punch_cards_user_id_seq" OWNED BY "public"."punch_cards"."user_id";



CREATE SEQUENCE IF NOT EXISTS "public"."raffle_entries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."raffle_entries_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."raffle_entries_id_seq" OWNED BY "public"."raffle_entries"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."raffle_entries_punch_card_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."raffle_entries_punch_card_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."raffle_entries_punch_card_id_seq" OWNED BY "public"."raffle_entries"."punch_card_id";



CREATE SEQUENCE IF NOT EXISTS "public"."raffle_entries_user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."raffle_entries_user_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."raffle_entries_user_id_seq" OWNED BY "public"."raffle_entries"."user_id";



CREATE TABLE IF NOT EXISTS "public"."restaurant_deals" (
    "id" bigint NOT NULL,
    "restaurant_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "active_date" timestamp with time zone
);


ALTER TABLE "public"."restaurant_deals" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."restaurant_deals_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."restaurant_deals_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."restaurant_deals_id_seq" OWNED BY "public"."restaurant_deals"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."restaurant_deals_restaurant_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."restaurant_deals_restaurant_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."restaurant_deals_restaurant_id_seq" OWNED BY "public"."restaurant_deals"."restaurant_id";



CREATE TABLE IF NOT EXISTS "public"."restaurants" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "address" "text" NOT NULL,
    "qr_code_url" "text",
    "code" integer,
    "contact_name" character varying,
    "contact_position" character varying,
    "email" character varying,
    "phone" character varying,
    "website" character varying,
    "qr_code_svg" character varying
);


ALTER TABLE "public"."restaurants" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."restaurants_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."restaurants_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."restaurants_id_seq" OWNED BY "public"."restaurants"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" bigint NOT NULL,
    "clerk_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "is_staff" boolean DEFAULT false,
    "is_admin" boolean DEFAULT false,
    "email" "text" NOT NULL,
    "phone" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";



ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."punch_cards" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."punch_cards_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."punch_cards" ALTER COLUMN "user_id" SET DEFAULT "nextval"('"public"."punch_cards_user_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."punch_cards" ALTER COLUMN "restaurant_id" SET DEFAULT "nextval"('"public"."punch_cards_restaurant_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."raffle_entries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."raffle_entries_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."raffle_entries" ALTER COLUMN "user_id" SET DEFAULT "nextval"('"public"."raffle_entries_user_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."raffle_entries" ALTER COLUMN "punch_card_id" SET DEFAULT "nextval"('"public"."raffle_entries_punch_card_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."restaurant_deals" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."restaurant_deals_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."restaurant_deals" ALTER COLUMN "restaurant_id" SET DEFAULT "nextval"('"public"."restaurant_deals_restaurant_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."restaurants" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."restaurants_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."punch_cards"
    ADD CONSTRAINT "punch_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."raffle_entries"
    ADD CONSTRAINT "raffle_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."restaurant_deals"
    ADD CONSTRAINT "restaurant_deals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."restaurants"
    ADD CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_clerk_id_unique" UNIQUE ("clerk_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "unique_restaurant_user_idx" ON "public"."punch_cards" USING "btree" ("user_id", "restaurant_id");



CREATE OR REPLACE TRIGGER "punch_card_raffle_trigger" AFTER INSERT ON "public"."punch_cards" FOR EACH ROW EXECUTE FUNCTION "public"."punch_card_after_insert"();



ALTER TABLE ONLY "public"."punch_cards"
    ADD CONSTRAINT "punch_cards_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id");



ALTER TABLE ONLY "public"."punch_cards"
    ADD CONSTRAINT "punch_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."raffle_entries"
    ADD CONSTRAINT "raffle_entries_punch_card_id_punch_cards_id_fk" FOREIGN KEY ("punch_card_id") REFERENCES "public"."punch_cards"("id");



ALTER TABLE ONLY "public"."raffle_entries"
    ADD CONSTRAINT "raffle_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."restaurant_deals"
    ADD CONSTRAINT "restaurant_deals_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id");



CREATE POLICY "Enable read access for all users" ON "public"."restaurant_deals" USING (true);



ALTER TABLE "public"."restaurant_deals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."restaurants" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."punch_cards";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."raffle_entries";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."restaurant_deals";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."restaurants";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON TABLE "public"."raffle_entries" TO "anon";
GRANT ALL ON TABLE "public"."raffle_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."raffle_entries" TO "service_role";



GRANT ALL ON FUNCTION "public"."UserEntersRaffle"("p_user_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."UserEntersRaffle"("p_user_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."UserEntersRaffle"("p_user_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."punch_card_after_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."punch_card_after_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."punch_card_after_insert"() TO "service_role";



























GRANT ALL ON TABLE "public"."punch_cards" TO "anon";
GRANT ALL ON TABLE "public"."punch_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."punch_cards" TO "service_role";



GRANT ALL ON SEQUENCE "public"."punch_cards_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."punch_cards_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."punch_cards_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."punch_cards_restaurant_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."punch_cards_restaurant_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."punch_cards_restaurant_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."punch_cards_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."punch_cards_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."punch_cards_user_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."raffle_entries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."raffle_entries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."raffle_entries_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."raffle_entries_punch_card_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."raffle_entries_punch_card_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."raffle_entries_punch_card_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."raffle_entries_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."raffle_entries_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."raffle_entries_user_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."restaurant_deals" TO "anon";
GRANT ALL ON TABLE "public"."restaurant_deals" TO "authenticated";
GRANT ALL ON TABLE "public"."restaurant_deals" TO "service_role";



GRANT ALL ON SEQUENCE "public"."restaurant_deals_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."restaurant_deals_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."restaurant_deals_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."restaurant_deals_restaurant_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."restaurant_deals_restaurant_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."restaurant_deals_restaurant_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."restaurants" TO "anon";
GRANT ALL ON TABLE "public"."restaurants" TO "authenticated";
GRANT ALL ON TABLE "public"."restaurants" TO "service_role";



GRANT ALL ON SEQUENCE "public"."restaurants_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."restaurants_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."restaurants_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
