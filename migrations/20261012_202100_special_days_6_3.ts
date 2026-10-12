import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_special_days_scope" AS ENUM('day', 'lunch', 'dinner');
  CREATE TABLE "special_days" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"scope" "enum_special_days_scope" NOT NULL,
  	"disabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "special_days_locales" (
  	"content_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "special_days_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fixed_menus_id" integer
  );
  
  ALTER TABLE "fixed_menus" ADD COLUMN "special_only" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "special_days_id" integer;
  ALTER TABLE "special_days_locales" ADD CONSTRAINT "special_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."special_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "special_days_rels" ADD CONSTRAINT "special_days_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."special_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "special_days_rels" ADD CONSTRAINT "special_days_rels_fixed_menus_fk" FOREIGN KEY ("fixed_menus_id") REFERENCES "public"."fixed_menus"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "special_days_updated_at_idx" ON "special_days" USING btree ("updated_at");
  CREATE INDEX "special_days_created_at_idx" ON "special_days" USING btree ("created_at");
  CREATE UNIQUE INDEX "special_days_locales_locale_parent_id_unique" ON "special_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "special_days_rels_order_idx" ON "special_days_rels" USING btree ("order");
  CREATE INDEX "special_days_rels_parent_idx" ON "special_days_rels" USING btree ("parent_id");
  CREATE INDEX "special_days_rels_path_idx" ON "special_days_rels" USING btree ("path");
  CREATE INDEX "special_days_rels_fixed_menus_id_idx" ON "special_days_rels" USING btree ("fixed_menus_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_special_days_fk" FOREIGN KEY ("special_days_id") REFERENCES "public"."special_days"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_special_days_id_idx" ON "payload_locked_documents_rels" USING btree ("special_days_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "special_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "special_days_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "special_days_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "special_days" CASCADE;
  DROP TABLE "special_days_locales" CASCADE;
  DROP TABLE "special_days_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_special_days_fk";
  
  DROP INDEX "payload_locked_documents_rels_special_days_id_idx";
  ALTER TABLE "fixed_menus" DROP COLUMN "special_only";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "special_days_id";
  DROP TYPE "public"."enum_special_days_scope";`)
}
