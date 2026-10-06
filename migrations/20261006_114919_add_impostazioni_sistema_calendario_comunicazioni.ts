import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_impostazioni_sistema_resend_senders_site" AS ENUM('vietnamonamour', 'villadoree');
  CREATE TABLE "impostazioni_sistema_resend_senders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"site" "enum_impostazioni_sistema_resend_senders_site" NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL
  );
  
  CREATE TABLE "impostazioni_sistema_staff_notification_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL
  );
  
  ALTER TABLE "impostazioni_sistema" ADD COLUMN "google_calendar_id" varchar;
  ALTER TABLE "impostazioni_sistema_resend_senders" ADD CONSTRAINT "impostazioni_sistema_resend_senders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."impostazioni_sistema"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "impostazioni_sistema_staff_notification_contacts" ADD CONSTRAINT "impostazioni_sistema_staff_notification_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."impostazioni_sistema"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "impostazioni_sistema_resend_senders_order_idx" ON "impostazioni_sistema_resend_senders" USING btree ("_order");
  CREATE INDEX "impostazioni_sistema_resend_senders_parent_id_idx" ON "impostazioni_sistema_resend_senders" USING btree ("_parent_id");
  CREATE INDEX "impostazioni_sistema_staff_notification_contacts_order_idx" ON "impostazioni_sistema_staff_notification_contacts" USING btree ("_order");
  CREATE INDEX "impostazioni_sistema_staff_notification_contacts_parent_id_idx" ON "impostazioni_sistema_staff_notification_contacts" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "impostazioni_sistema_resend_senders" CASCADE;
  DROP TABLE "impostazioni_sistema_staff_notification_contacts" CASCADE;
  ALTER TABLE "impostazioni_sistema" DROP COLUMN "google_calendar_id";
  DROP TYPE "public"."enum_impostazioni_sistema_resend_senders_site";`)
}
