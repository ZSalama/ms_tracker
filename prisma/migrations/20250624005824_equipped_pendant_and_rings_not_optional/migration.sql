/*
  Warnings:

  - Made the column `equippedPendantsIds` on table `character` required. This step will fail if there are existing NULL values in that column.
  - Made the column `equippedRingsIds` on table `character` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "character" ALTER COLUMN "equippedPendantsIds" SET NOT NULL,
ALTER COLUMN "equippedRingsIds" SET NOT NULL;
