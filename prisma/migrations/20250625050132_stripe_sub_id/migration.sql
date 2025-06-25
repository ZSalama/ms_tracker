-- AlterTable
ALTER TABLE "user" ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "subscription" TEXT NOT NULL DEFAULT 'free';
