import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_users_admin_role" ADD VALUE 'manager' BEFORE 'admin';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "admin_role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "admin_role" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_users_admin_role";
  CREATE TYPE "public"."enum_users_admin_role" AS ENUM('none', 'admin', 'super-admin');
  ALTER TABLE "users" ALTER COLUMN "admin_role" SET DEFAULT 'none'::"public"."enum_users_admin_role";
  ALTER TABLE "users" ALTER COLUMN "admin_role" SET DATA TYPE "public"."enum_users_admin_role" USING "admin_role"::"public"."enum_users_admin_role";`)
}
