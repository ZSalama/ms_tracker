/*
  Warnings:

  - A unique constraint covering the columns `[stripeId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "stripeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeId_key" ON "user"("stripeId");
