/*
  Warnings:

  - The values [CONVETION] on the enum `entryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "entryType_new" AS ENUM ('DECISION', 'CONVENTION', 'SNIPPET', 'TASK_STATUS');
ALTER TABLE "ContextEntry" ALTER COLUMN "type" TYPE "entryType_new" USING ("type"::text::"entryType_new");
ALTER TYPE "entryType" RENAME TO "entryType_old";
ALTER TYPE "entryType_new" RENAME TO "entryType";
DROP TYPE "public"."entryType_old";
COMMIT;
