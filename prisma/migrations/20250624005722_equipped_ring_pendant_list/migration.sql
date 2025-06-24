-- AlterTable
ALTER TABLE "character" ADD COLUMN     "equippedPendantsIds" TEXT DEFAULT '[]',
ADD COLUMN     "equippedRingsIds" TEXT DEFAULT '[]';
