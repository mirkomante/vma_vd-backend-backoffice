import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fixed_menu_categories_visibility" AS ENUM('always', 'lunch_only', 'dinner_only');
  CREATE TYPE "public"."enum_fixed_menus_visibility" AS ENUM('always', 'lunch_only', 'dinner_only');
  CREATE TABLE "dishes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL,
  	"category_id" integer NOT NULL,
  	"gluten_free" boolean DEFAULT false,
  	"dairy_free" boolean DEFAULT false,
  	"vegan" boolean DEFAULT false,
  	"egg_free" boolean DEFAULT false,
  	"sold_out" boolean DEFAULT false,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dishes_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dishes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"allergens_id" integer
  );
  
  CREATE TABLE "wines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"winery" varchar,
  	"year" varchar,
  	"volume" varchar,
  	"abv" varchar,
  	"price" numeric NOT NULL,
  	"glass_price" numeric,
  	"classification_id" integer,
  	"country_id" integer NOT NULL,
  	"region_id" integer,
  	"appellation_id" integer,
  	"type_id" integer NOT NULL,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wines_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "spirits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"abv" varchar,
  	"aging" varchar,
  	"volume" varchar,
  	"price" numeric NOT NULL,
  	"country_id" integer NOT NULL,
  	"type_id" integer NOT NULL,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "spirits_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "drinks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL,
  	"type_id" integer NOT NULL,
  	"country_id" integer,
  	"abv" varchar,
  	"volume" varchar,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "drinks_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "drinks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"allergens_id" integer
  );
  
  CREATE TABLE "menu_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menu_services_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "fixed_menu_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visibility" "enum_fixed_menu_categories_visibility" DEFAULT 'always' NOT NULL,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "fixed_menu_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "fixed_menus_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dish_id" integer NOT NULL
  );
  
  CREATE TABLE "fixed_menus_dishes_locales" (
  	"portion" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "fixed_menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL,
  	"category_id" integer NOT NULL,
  	"visibility" "enum_fixed_menus_visibility" DEFAULT 'always' NOT NULL,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "fixed_menus_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "fixed_menus_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"menu_services_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "dishes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wines_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "spirits_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "drinks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "menu_services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fixed_menu_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fixed_menus_id" integer;
  ALTER TABLE "dishes" ADD CONSTRAINT "dishes_category_id_dish_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."dish_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dishes_locales" ADD CONSTRAINT "dishes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes_rels" ADD CONSTRAINT "dishes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dishes_rels" ADD CONSTRAINT "dishes_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_classification_id_classifications_id_fk" FOREIGN KEY ("classification_id") REFERENCES "public"."classifications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_appellation_id_appellations_id_fk" FOREIGN KEY ("appellation_id") REFERENCES "public"."appellations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_type_id_wine_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."wine_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines_locales" ADD CONSTRAINT "wines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "spirits" ADD CONSTRAINT "spirits_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "spirits" ADD CONSTRAINT "spirits_type_id_spirit_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."spirit_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "spirits_locales" ADD CONSTRAINT "spirits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."spirits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drinks" ADD CONSTRAINT "drinks_type_id_drink_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."drink_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "drinks" ADD CONSTRAINT "drinks_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "drinks_locales" ADD CONSTRAINT "drinks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drinks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drinks_rels" ADD CONSTRAINT "drinks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drinks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drinks_rels" ADD CONSTRAINT "drinks_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_services_locales" ADD CONSTRAINT "menu_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixed_menu_categories_locales" ADD CONSTRAINT "fixed_menu_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fixed_menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixed_menus_dishes" ADD CONSTRAINT "fixed_menus_dishes_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fixed_menus_dishes" ADD CONSTRAINT "fixed_menus_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fixed_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixed_menus_dishes_locales" ADD CONSTRAINT "fixed_menus_dishes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fixed_menus_dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixed_menus" ADD CONSTRAINT "fixed_menus_category_id_fixed_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."fixed_menu_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fixed_menus_locales" ADD CONSTRAINT "fixed_menus_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fixed_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixed_menus_rels" ADD CONSTRAINT "fixed_menus_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fixed_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixed_menus_rels" ADD CONSTRAINT "fixed_menus_rels_menu_services_fk" FOREIGN KEY ("menu_services_id") REFERENCES "public"."menu_services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "dishes_category_idx" ON "dishes" USING btree ("category_id");
  CREATE INDEX "dishes_updated_at_idx" ON "dishes" USING btree ("updated_at");
  CREATE INDEX "dishes_created_at_idx" ON "dishes" USING btree ("created_at");
  CREATE UNIQUE INDEX "dishes_locales_locale_parent_id_unique" ON "dishes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "dishes_rels_order_idx" ON "dishes_rels" USING btree ("order");
  CREATE INDEX "dishes_rels_parent_idx" ON "dishes_rels" USING btree ("parent_id");
  CREATE INDEX "dishes_rels_path_idx" ON "dishes_rels" USING btree ("path");
  CREATE INDEX "dishes_rels_allergens_id_idx" ON "dishes_rels" USING btree ("allergens_id");
  CREATE INDEX "wines_classification_idx" ON "wines" USING btree ("classification_id");
  CREATE INDEX "wines_country_idx" ON "wines" USING btree ("country_id");
  CREATE INDEX "wines_region_idx" ON "wines" USING btree ("region_id");
  CREATE INDEX "wines_appellation_idx" ON "wines" USING btree ("appellation_id");
  CREATE INDEX "wines_type_idx" ON "wines" USING btree ("type_id");
  CREATE INDEX "wines_updated_at_idx" ON "wines" USING btree ("updated_at");
  CREATE INDEX "wines_created_at_idx" ON "wines" USING btree ("created_at");
  CREATE UNIQUE INDEX "wines_locales_locale_parent_id_unique" ON "wines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "spirits_country_idx" ON "spirits" USING btree ("country_id");
  CREATE INDEX "spirits_type_idx" ON "spirits" USING btree ("type_id");
  CREATE INDEX "spirits_updated_at_idx" ON "spirits" USING btree ("updated_at");
  CREATE INDEX "spirits_created_at_idx" ON "spirits" USING btree ("created_at");
  CREATE UNIQUE INDEX "spirits_locales_locale_parent_id_unique" ON "spirits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "drinks_type_idx" ON "drinks" USING btree ("type_id");
  CREATE INDEX "drinks_country_idx" ON "drinks" USING btree ("country_id");
  CREATE INDEX "drinks_updated_at_idx" ON "drinks" USING btree ("updated_at");
  CREATE INDEX "drinks_created_at_idx" ON "drinks" USING btree ("created_at");
  CREATE UNIQUE INDEX "drinks_locales_locale_parent_id_unique" ON "drinks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "drinks_rels_order_idx" ON "drinks_rels" USING btree ("order");
  CREATE INDEX "drinks_rels_parent_idx" ON "drinks_rels" USING btree ("parent_id");
  CREATE INDEX "drinks_rels_path_idx" ON "drinks_rels" USING btree ("path");
  CREATE INDEX "drinks_rels_allergens_id_idx" ON "drinks_rels" USING btree ("allergens_id");
  CREATE INDEX "menu_services_updated_at_idx" ON "menu_services" USING btree ("updated_at");
  CREATE INDEX "menu_services_created_at_idx" ON "menu_services" USING btree ("created_at");
  CREATE UNIQUE INDEX "menu_services_locales_locale_parent_id_unique" ON "menu_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fixed_menu_categories_updated_at_idx" ON "fixed_menu_categories" USING btree ("updated_at");
  CREATE INDEX "fixed_menu_categories_created_at_idx" ON "fixed_menu_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "fixed_menu_categories_locales_locale_parent_id_unique" ON "fixed_menu_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fixed_menus_dishes_order_idx" ON "fixed_menus_dishes" USING btree ("_order");
  CREATE INDEX "fixed_menus_dishes_parent_id_idx" ON "fixed_menus_dishes" USING btree ("_parent_id");
  CREATE INDEX "fixed_menus_dishes_dish_idx" ON "fixed_menus_dishes" USING btree ("dish_id");
  CREATE UNIQUE INDEX "fixed_menus_dishes_locales_locale_parent_id_unique" ON "fixed_menus_dishes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fixed_menus_category_idx" ON "fixed_menus" USING btree ("category_id");
  CREATE INDEX "fixed_menus_updated_at_idx" ON "fixed_menus" USING btree ("updated_at");
  CREATE INDEX "fixed_menus_created_at_idx" ON "fixed_menus" USING btree ("created_at");
  CREATE UNIQUE INDEX "fixed_menus_locales_locale_parent_id_unique" ON "fixed_menus_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fixed_menus_rels_order_idx" ON "fixed_menus_rels" USING btree ("order");
  CREATE INDEX "fixed_menus_rels_parent_idx" ON "fixed_menus_rels" USING btree ("parent_id");
  CREATE INDEX "fixed_menus_rels_path_idx" ON "fixed_menus_rels" USING btree ("path");
  CREATE INDEX "fixed_menus_rels_menu_services_id_idx" ON "fixed_menus_rels" USING btree ("menu_services_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dishes_fk" FOREIGN KEY ("dishes_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wines_fk" FOREIGN KEY ("wines_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_spirits_fk" FOREIGN KEY ("spirits_id") REFERENCES "public"."spirits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drinks_fk" FOREIGN KEY ("drinks_id") REFERENCES "public"."drinks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_services_fk" FOREIGN KEY ("menu_services_id") REFERENCES "public"."menu_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fixed_menu_categories_fk" FOREIGN KEY ("fixed_menu_categories_id") REFERENCES "public"."fixed_menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fixed_menus_fk" FOREIGN KEY ("fixed_menus_id") REFERENCES "public"."fixed_menus"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_dishes_id_idx" ON "payload_locked_documents_rels" USING btree ("dishes_id");
  CREATE INDEX "payload_locked_documents_rels_wines_id_idx" ON "payload_locked_documents_rels" USING btree ("wines_id");
  CREATE INDEX "payload_locked_documents_rels_spirits_id_idx" ON "payload_locked_documents_rels" USING btree ("spirits_id");
  CREATE INDEX "payload_locked_documents_rels_drinks_id_idx" ON "payload_locked_documents_rels" USING btree ("drinks_id");
  CREATE INDEX "payload_locked_documents_rels_menu_services_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_services_id");
  CREATE INDEX "payload_locked_documents_rels_fixed_menu_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("fixed_menu_categories_id");
  CREATE INDEX "payload_locked_documents_rels_fixed_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("fixed_menus_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "dishes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dishes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dishes_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wines_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spirits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spirits_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drinks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drinks_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drinks_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixed_menu_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixed_menu_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixed_menus_dishes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixed_menus_dishes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixed_menus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixed_menus_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixed_menus_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "dishes" CASCADE;
  DROP TABLE "dishes_locales" CASCADE;
  DROP TABLE "dishes_rels" CASCADE;
  DROP TABLE "wines" CASCADE;
  DROP TABLE "wines_locales" CASCADE;
  DROP TABLE "spirits" CASCADE;
  DROP TABLE "spirits_locales" CASCADE;
  DROP TABLE "drinks" CASCADE;
  DROP TABLE "drinks_locales" CASCADE;
  DROP TABLE "drinks_rels" CASCADE;
  DROP TABLE "menu_services" CASCADE;
  DROP TABLE "menu_services_locales" CASCADE;
  DROP TABLE "fixed_menu_categories" CASCADE;
  DROP TABLE "fixed_menu_categories_locales" CASCADE;
  DROP TABLE "fixed_menus_dishes" CASCADE;
  DROP TABLE "fixed_menus_dishes_locales" CASCADE;
  DROP TABLE "fixed_menus" CASCADE;
  DROP TABLE "fixed_menus_locales" CASCADE;
  DROP TABLE "fixed_menus_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_dishes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_wines_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_spirits_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_drinks_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_menu_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fixed_menu_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fixed_menus_fk";
  
  DROP INDEX "payload_locked_documents_rels_dishes_id_idx";
  DROP INDEX "payload_locked_documents_rels_wines_id_idx";
  DROP INDEX "payload_locked_documents_rels_spirits_id_idx";
  DROP INDEX "payload_locked_documents_rels_drinks_id_idx";
  DROP INDEX "payload_locked_documents_rels_menu_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_fixed_menu_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_fixed_menus_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "dishes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "wines_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "spirits_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "drinks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "menu_services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "fixed_menu_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "fixed_menus_id";
  DROP TYPE "public"."enum_fixed_menu_categories_visibility";
  DROP TYPE "public"."enum_fixed_menus_visibility";`)
}
