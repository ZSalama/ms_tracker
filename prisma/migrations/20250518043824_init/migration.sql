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
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Unnamed',
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
    "attack_power_increase" INTEGER NOT NULL DEFAULT 0,
    "combat_power_increase" INTEGER NOT NULL DEFAULT 0,
    "required_level" INTEGER NOT NULL DEFAULT 0,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isEquipped" BOOLEAN NOT NULL DEFAULT false,
    "str" INTEGER NOT NULL DEFAULT 0,
    "flameStr" INTEGER NOT NULL DEFAULT 0,
    "starStr" INTEGER NOT NULL DEFAULT 0,
    "Dex" INTEGER NOT NULL DEFAULT 0,
    "flameDex" INTEGER NOT NULL DEFAULT 0,
    "starDex" INTEGER NOT NULL DEFAULT 0,
    "int" INTEGER NOT NULL DEFAULT 0,
    "flameint" INTEGER NOT NULL DEFAULT 0,
    "starint" INTEGER NOT NULL DEFAULT 0,
    "LUK" INTEGER NOT NULL DEFAULT 0,
    "flameLUK" INTEGER NOT NULL DEFAULT 0,
    "starLUK" INTEGER NOT NULL DEFAULT 0,
    "maxHP" INTEGER NOT NULL DEFAULT 0,
    "flameMaxHP" INTEGER NOT NULL DEFAULT 0,
    "starMaxHP" INTEGER NOT NULL DEFAULT 0,
    "maxMP" INTEGER NOT NULL DEFAULT 0,
    "flameMaxMP" INTEGER NOT NULL DEFAULT 0,
    "starMaxMP" INTEGER NOT NULL DEFAULT 0,
    "attackPower" INTEGER NOT NULL DEFAULT 0,
    "flameAttackPower" INTEGER NOT NULL DEFAULT 0,
    "starAttackPower" INTEGER NOT NULL DEFAULT 0,
    "magicAttackPower" INTEGER NOT NULL DEFAULT 0,
    "flameMagicAttackPower" INTEGER NOT NULL DEFAULT 0,
    "starMagicAttackPower" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "flameDefense" INTEGER NOT NULL DEFAULT 0,
    "starDefense" INTEGER NOT NULL DEFAULT 0,
    "jump" INTEGER NOT NULL DEFAULT 0,
    "flameJump" INTEGER NOT NULL DEFAULT 0,
    "starJump" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "flameSpeed" INTEGER NOT NULL DEFAULT 0,
    "starSpeed" INTEGER NOT NULL DEFAULT 0,
    "allStat" TEXT NOT NULL DEFAULT '0',
    "flameAllStat" TEXT NOT NULL DEFAULT '0',
    "starAllStat" TEXT NOT NULL DEFAULT '0',
    "bossDamage" TEXT NOT NULL DEFAULT '0',
    "flameBossDamage" TEXT NOT NULL DEFAULT '0',
    "starBossDamage" TEXT NOT NULL DEFAULT '0',
    "ignoreEnemyDefense" TEXT NOT NULL DEFAULT '0',
    "flameIgnoreEnemyDefense" TEXT NOT NULL DEFAULT '0',
    "potential" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "GearItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_clerkId_key" ON "user"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "character" ADD CONSTRAINT "character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
