import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "dish_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dish_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "allergens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "allergens_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "countries_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"country_id" integer NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "regions_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "appellations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"region_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "classifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"country_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "spirit_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "spirit_types_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "wine_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wine_types_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "drink_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "drink_types_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "menu_general" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "menu_general_locales" (
  	"global_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "dish_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "allergens_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "countries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "regions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appellations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "classifications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "spirit_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wine_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "drink_types_id" integer;
  ALTER TABLE "dish_categories_locales" ADD CONSTRAINT "dish_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dish_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "allergens_locales" ADD CONSTRAINT "allergens_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_locales" ADD CONSTRAINT "countries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regions_locales" ADD CONSTRAINT "regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appellations" ADD CONSTRAINT "appellations_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "classifications" ADD CONSTRAINT "classifications_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "spirit_types_locales" ADD CONSTRAINT "spirit_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."spirit_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wine_types_locales" ADD CONSTRAINT "wine_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wine_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drink_types_locales" ADD CONSTRAINT "drink_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drink_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_general_locales" ADD CONSTRAINT "menu_general_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_general"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "dish_categories_updated_at_idx" ON "dish_categories" USING btree ("updated_at");
  CREATE INDEX "dish_categories_created_at_idx" ON "dish_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "dish_categories_locales_locale_parent_id_unique" ON "dish_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "allergens_updated_at_idx" ON "allergens" USING btree ("updated_at");
  CREATE INDEX "allergens_created_at_idx" ON "allergens" USING btree ("created_at");
  CREATE UNIQUE INDEX "allergens_locales_locale_parent_id_unique" ON "allergens_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE UNIQUE INDEX "countries_locales_locale_parent_id_unique" ON "countries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "regions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "appellations_region_idx" ON "appellations" USING btree ("region_id");
  CREATE INDEX "appellations_updated_at_idx" ON "appellations" USING btree ("updated_at");
  CREATE INDEX "appellations_created_at_idx" ON "appellations" USING btree ("created_at");
  CREATE INDEX "classifications_country_idx" ON "classifications" USING btree ("country_id");
  CREATE INDEX "classifications_updated_at_idx" ON "classifications" USING btree ("updated_at");
  CREATE INDEX "classifications_created_at_idx" ON "classifications" USING btree ("created_at");
  CREATE INDEX "spirit_types_updated_at_idx" ON "spirit_types" USING btree ("updated_at");
  CREATE INDEX "spirit_types_created_at_idx" ON "spirit_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "spirit_types_locales_locale_parent_id_unique" ON "spirit_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "wine_types_updated_at_idx" ON "wine_types" USING btree ("updated_at");
  CREATE INDEX "wine_types_created_at_idx" ON "wine_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "wine_types_locales_locale_parent_id_unique" ON "wine_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "drink_types_updated_at_idx" ON "drink_types" USING btree ("updated_at");
  CREATE INDEX "drink_types_created_at_idx" ON "drink_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "drink_types_locales_locale_parent_id_unique" ON "drink_types_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "menu_general_locales_locale_parent_id_unique" ON "menu_general_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dish_categories_fk" FOREIGN KEY ("dish_categories_id") REFERENCES "public"."dish_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appellations_fk" FOREIGN KEY ("appellations_id") REFERENCES "public"."appellations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_classifications_fk" FOREIGN KEY ("classifications_id") REFERENCES "public"."classifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_spirit_types_fk" FOREIGN KEY ("spirit_types_id") REFERENCES "public"."spirit_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wine_types_fk" FOREIGN KEY ("wine_types_id") REFERENCES "public"."wine_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drink_types_fk" FOREIGN KEY ("drink_types_id") REFERENCES "public"."drink_types"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_dish_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("dish_categories_id");
  CREATE INDEX "payload_locked_documents_rels_allergens_id_idx" ON "payload_locked_documents_rels" USING btree ("allergens_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_appellations_id_idx" ON "payload_locked_documents_rels" USING btree ("appellations_id");
  CREATE INDEX "payload_locked_documents_rels_classifications_id_idx" ON "payload_locked_documents_rels" USING btree ("classifications_id");
  CREATE INDEX "payload_locked_documents_rels_spirit_types_id_idx" ON "payload_locked_documents_rels" USING btree ("spirit_types_id");
  CREATE INDEX "payload_locked_documents_rels_wine_types_id_idx" ON "payload_locked_documents_rels" USING btree ("wine_types_id");
  CREATE INDEX "payload_locked_documents_rels_drink_types_id_idx" ON "payload_locked_documents_rels" USING btree ("drink_types_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "dish_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dish_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "allergens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "allergens_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "regions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "regions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "appellations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "classifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spirit_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spirit_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wine_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wine_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drink_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drink_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_general" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_general_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "dish_categories" CASCADE;
  DROP TABLE "dish_categories_locales" CASCADE;
  DROP TABLE "allergens" CASCADE;
  DROP TABLE "allergens_locales" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "countries_locales" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "regions_locales" CASCADE;
  DROP TABLE "appellations" CASCADE;
  DROP TABLE "classifications" CASCADE;
  DROP TABLE "spirit_types" CASCADE;
  DROP TABLE "spirit_types_locales" CASCADE;
  DROP TABLE "wine_types" CASCADE;
  DROP TABLE "wine_types_locales" CASCADE;
  DROP TABLE "drink_types" CASCADE;
  DROP TABLE "drink_types_locales" CASCADE;
  DROP TABLE "menu_general" CASCADE;
  DROP TABLE "menu_general_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_dish_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_allergens_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_countries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_regions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appellations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_classifications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_spirit_types_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_wine_types_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_drink_types_fk";
  
  DROP INDEX "payload_locked_documents_rels_dish_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_allergens_id_idx";
  DROP INDEX "payload_locked_documents_rels_countries_id_idx";
  DROP INDEX "payload_locked_documents_rels_regions_id_idx";
  DROP INDEX "payload_locked_documents_rels_appellations_id_idx";
  DROP INDEX "payload_locked_documents_rels_classifications_id_idx";
  DROP INDEX "payload_locked_documents_rels_spirit_types_id_idx";
  DROP INDEX "payload_locked_documents_rels_wine_types_id_idx";
  DROP INDEX "payload_locked_documents_rels_drink_types_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "dish_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "allergens_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "countries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "regions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appellations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "classifications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "spirit_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "wine_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "drink_types_id";`)
}
