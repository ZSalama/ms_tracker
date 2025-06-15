-- AlterTable
ALTER TABLE "GearItem" ADD COLUMN     "totalFlameScore" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "character" ADD COLUMN     "flameWeightAllStat" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "flameWeightAttack" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "flameWeightAttackType" TEXT NOT NULL DEFAULT 'Attack',
ADD COLUMN     "flameWeightDamage" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "flameWeightMainStat" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "flameWeightMainType" TEXT NOT NULL DEFAULT 'Str',
ADD COLUMN     "flameWeightSubType" TEXT NOT NULL DEFAULT 'Dex',
ADD COLUMN     "totalFlameScore" INTEGER NOT NULL DEFAULT 0;
