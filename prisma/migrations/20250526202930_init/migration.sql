-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "legion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "class" TEXT NOT NULL DEFAULT 'beginner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "combatPower" INTEGER NOT NULL DEFAULT 0,
    "arcaneForce" INTEGER NOT NULL DEFAULT 0,
    "sacredPower" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Unnamed',
    "type" TEXT NOT NULL DEFAULT 'Ring',
    "rarity" TEXT NOT NULL DEFAULT 'None',
    "trade_status" TEXT NOT NULL DEFAULT 'untradeable',
    "star_force" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT,
    "attack_power_increase" INTEGER NOT NULL DEFAULT 0,
    "combat_power_increase" INTEGER NOT NULL DEFAULT 0,
    "required_level" INTEGER NOT NULL DEFAULT 0,
    "characterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isEquipped" BOOLEAN NOT NULL DEFAULT false,
    "totalStr" INTEGER,
    "baseStr" INTEGER,
    "flameStr" INTEGER,
    "starStr" INTEGER,
    "totalDex" INTEGER,
    "baseDex" INTEGER,
    "flameDex" INTEGER,
    "starDex" INTEGER,
    "totalInt" INTEGER,
    "baseInt" INTEGER,
    "flameInt" INTEGER,
    "starInt" INTEGER,
    "totalLuk" INTEGER,
    "baseLuk" INTEGER,
    "flameLuk" INTEGER,
    "starLuk" INTEGER,
    "totalMaxHP" INTEGER,
    "baseMaxHP" INTEGER,
    "flameMaxHP" INTEGER,
    "starMaxHP" INTEGER,
    "totalMaxMP" INTEGER,
    "baseMaxMP" INTEGER,
    "flameMaxMP" INTEGER,
    "starMaxMP" INTEGER,
    "totalAttackPower" INTEGER,
    "baseAttackPower" INTEGER,
    "flameAttackPower" INTEGER,
    "starAttackPower" INTEGER,
    "totalMagicAttackPower" INTEGER,
    "baseMagicAttackPower" INTEGER,
    "flameMagicAttackPower" INTEGER,
    "starMagicAttackPower" INTEGER,
    "totalDefense" INTEGER,
    "baseDefense" INTEGER,
    "flameDefense" INTEGER,
    "starDefense" INTEGER,
    "totalJump" INTEGER,
    "baseJump" INTEGER,
    "flameJump" INTEGER,
    "starJump" INTEGER,
    "totalSpeed" INTEGER,
    "baseSpeed" INTEGER,
    "flameSpeed" INTEGER,
    "starSpeed" INTEGER,
    "totalAllStat" INTEGER,
    "baseAllStat" INTEGER,
    "flameAllStat" INTEGER,
    "totalBossDamage" INTEGER,
    "baseBossDamage" INTEGER,
    "flameBossDamage" INTEGER,
    "totalIgnoreEnemyDefense" INTEGER,
    "baseIgnoreEnemyDefense" INTEGER,
    "flameIgnoreEnemyDefense" INTEGER,
    "potential" JSONB DEFAULT '{}',

    CONSTRAINT "GearItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_clerkId_key" ON "user"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "character_name_key" ON "character"("name");

-- AddForeignKey
ALTER TABLE "character" ADD CONSTRAINT "character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
