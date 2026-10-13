import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_activity_log_event_type" ADD VALUE 'systemAction';
  ALTER TABLE "activity_log" ALTER COLUMN "user_id" DROP NOT NULL;
  ALTER TABLE "activity_log" ADD COLUMN "detail" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "activity_log" ALTER COLUMN "event_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_activity_log_event_type";
  CREATE TYPE "public"."enum_activity_log_event_type" AS ENUM('login', 'logout', 'accessDenied', 'create', 'update', 'delete');
  ALTER TABLE "activity_log" ALTER COLUMN "event_type" SET DATA TYPE "public"."enum_activity_log_event_type" USING "event_type"::"public"."enum_activity_log_event_type";
  ALTER TABLE "activity_log" ALTER COLUMN "user_id" SET NOT NULL;
  ALTER TABLE "activity_log" DROP COLUMN "detail";`)
}
