/*
  Warnings:

  - You are about to drop the column `potential` on the `GearItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GearItem" DROP COLUMN "potential",
ADD COLUMN     "potential_line_1" TEXT DEFAULT 'None',
ADD COLUMN     "potential_line_1_value" TEXT DEFAULT '0',
ADD COLUMN     "potential_line_2" TEXT DEFAULT 'None',
ADD COLUMN     "potential_line_2_value" TEXT DEFAULT '0',
ADD COLUMN     "potential_line_3" TEXT DEFAULT 'None',
ADD COLUMN     "potential_line_3_value" TEXT DEFAULT '0';
