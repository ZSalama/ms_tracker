/*
  Warnings:

  - You are about to drop the column `potSlot1` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potSlot2` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potSlot3` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_1_id` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_2_id` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_3_id` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the `Potential` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_potential_1_id_fkey";

-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_potential_2_id_fkey";

-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_potential_3_id_fkey";

-- DropIndex
DROP INDEX "GearItem_potential_1_id_key";

-- DropIndex
DROP INDEX "GearItem_potential_2_id_key";

-- DropIndex
DROP INDEX "GearItem_potential_3_id_key";

-- AlterTable
ALTER TABLE "GearItem" DROP COLUMN "potSlot1",
DROP COLUMN "potSlot2",
DROP COLUMN "potSlot3",
DROP COLUMN "potential_1_id",
DROP COLUMN "potential_2_id",
DROP COLUMN "potential_3_id",
ADD COLUMN     "potType1" TEXT,
ADD COLUMN     "potType2" TEXT,
ADD COLUMN     "potType3" TEXT,
ADD COLUMN     "potValue1" TEXT,
ADD COLUMN     "potValue2" TEXT,
ADD COLUMN     "potValue3" TEXT;

-- DropTable
DROP TABLE "Potential";
