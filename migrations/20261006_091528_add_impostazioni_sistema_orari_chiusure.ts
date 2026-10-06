import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_impostazioni_sistema_services_name" AS ENUM('lunch', 'dinner');
  CREATE TYPE "public"."enum_impostazioni_sistema_weekly_closed_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TABLE "impostazioni_sistema_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" "enum_impostazioni_sistema_services_name" NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL
  );
  
  CREATE TABLE "impostazioni_sistema_weekly_closed_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_impostazioni_sistema_weekly_closed_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "impostazioni_sistema_annual_closures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "impostazioni_sistema" ADD COLUMN "bnb_check_in_time" varchar NOT NULL;
  ALTER TABLE "impostazioni_sistema" ADD COLUMN "bnb_check_out_time" varchar NOT NULL;
  ALTER TABLE "impostazioni_sistema_services" ADD CONSTRAINT "impostazioni_sistema_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."impostazioni_sistema"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "impostazioni_sistema_weekly_closed_days" ADD CONSTRAINT "impostazioni_sistema_weekly_closed_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."impostazioni_sistema"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "impostazioni_sistema_annual_closures" ADD CONSTRAINT "impostazioni_sistema_annual_closures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."impostazioni_sistema"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "impostazioni_sistema_services_order_idx" ON "impostazioni_sistema_services" USING btree ("_order");
  CREATE INDEX "impostazioni_sistema_services_parent_id_idx" ON "impostazioni_sistema_services" USING btree ("_parent_id");
  CREATE INDEX "impostazioni_sistema_weekly_closed_days_order_idx" ON "impostazioni_sistema_weekly_closed_days" USING btree ("order");
  CREATE INDEX "impostazioni_sistema_weekly_closed_days_parent_idx" ON "impostazioni_sistema_weekly_closed_days" USING btree ("parent_id");
  CREATE INDEX "impostazioni_sistema_annual_closures_order_idx" ON "impostazioni_sistema_annual_closures" USING btree ("_order");
  CREATE INDEX "impostazioni_sistema_annual_closures_parent_id_idx" ON "impostazioni_sistema_annual_closures" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "impostazioni_sistema_services" CASCADE;
  DROP TABLE "impostazioni_sistema_weekly_closed_days" CASCADE;
  DROP TABLE "impostazioni_sistema_annual_closures" CASCADE;
  ALTER TABLE "impostazioni_sistema" DROP COLUMN "bnb_check_in_time";
  ALTER TABLE "impostazioni_sistema" DROP COLUMN "bnb_check_out_time";
  DROP TYPE "public"."enum_impostazioni_sistema_services_name";
  DROP TYPE "public"."enum_impostazioni_sistema_weekly_closed_days";`)
}
