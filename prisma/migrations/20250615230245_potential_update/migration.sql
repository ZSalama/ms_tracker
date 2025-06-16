/*
  Warnings:

  - You are about to drop the column `potential_line_1` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_line_1_value` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_line_2` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_line_2_value` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_line_3` on the `GearItem` table. All the data in the column will be lost.
  - You are about to drop the column `potential_line_3_value` on the `GearItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[potential_1_id]` on the table `GearItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[potential_2_id]` on the table `GearItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[potential_3_id]` on the table `GearItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GearItem" DROP COLUMN "potential_line_1",
DROP COLUMN "potential_line_1_value",
DROP COLUMN "potential_line_2",
DROP COLUMN "potential_line_2_value",
DROP COLUMN "potential_line_3",
DROP COLUMN "potential_line_3_value",
ADD COLUMN     "potential_1_id" INTEGER,
ADD COLUMN     "potential_2_id" INTEGER,
ADD COLUMN     "potential_3_id" INTEGER;

-- CreateTable
CREATE TABLE "Potential" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'None',
    "value" TEXT NOT NULL DEFAULT 'None',

    CONSTRAINT "Potential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GearItem_potential_1_id_key" ON "GearItem"("potential_1_id");

-- CreateIndex
CREATE UNIQUE INDEX "GearItem_potential_2_id_key" ON "GearItem"("potential_2_id");

-- CreateIndex
CREATE UNIQUE INDEX "GearItem_potential_3_id_key" ON "GearItem"("potential_3_id");

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_potential_1_id_fkey" FOREIGN KEY ("potential_1_id") REFERENCES "Potential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_potential_2_id_fkey" FOREIGN KEY ("potential_2_id") REFERENCES "Potential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_potential_3_id_fkey" FOREIGN KEY ("potential_3_id") REFERENCES "Potential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
