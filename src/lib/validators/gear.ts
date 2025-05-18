import { z } from 'zod'

export const gearSchema = z.object({
    /* ------------ linkage ------------ */
    characterId: z.string().cuid(),

    /* ------------ basic meta ------------ */
    name: z.string().min(1, 'Name is required').max(100),
    type: z.string().min(1),
    rarity: z.string().min(1),
    tradeStatus: z.string().min(1),
    starForce: z.coerce.number().int().min(0),

    attackPowerIncrease: z.coerce.number().int().min(0),
    combatPowerIncrease: z.coerce.number().int().min(0),
    requiredLevel: z.coerce.number().int().min(0),

    isEquipped: z.coerce.boolean().optional(),

    /* ------------ core stats ------------ */
    str: z.coerce.number().int().min(0).optional(),
    flameStr: z.coerce.number().int().min(0).optional(),
    starStr: z.coerce.number().int().min(0).optional(),

    Dex: z.coerce.number().int().min(0).optional(),
    flameDex: z.coerce.number().int().min(0).optional(),
    starDex: z.coerce.number().int().min(0).optional(),

    int: z.coerce.number().int().min(0).optional(),
    flameint: z.coerce.number().int().min(0).optional(),
    starint: z.coerce.number().int().min(0).optional(),

    LUK: z.coerce.number().int().min(0).optional(),
    flameLUK: z.coerce.number().int().min(0).optional(),
    starLUK: z.coerce.number().int().min(0).optional(),

    /* ------------ HP / MP ------------ */
    maxHP: z.coerce.number().int().min(0).optional(),
    flameMaxHP: z.coerce.number().int().min(0).optional(),
    starMaxHP: z.coerce.number().int().min(0).optional(),

    maxMP: z.coerce.number().int().min(0).optional(),
    flameMaxMP: z.coerce.number().int().min(0).optional(),
    starMaxMP: z.coerce.number().int().min(0).optional(),

    /* ------------ attack / magic / defense ------------ */
    attackPower: z.coerce.number().int().min(0).optional(),
    flameAttackPower: z.coerce.number().int().min(0).optional(),
    starAttackPower: z.coerce.number().int().min(0).optional(),

    magicAttackPower: z.coerce.number().int().min(0).optional(),
    flameMagicAttackPower: z.coerce.number().int().min(0).optional(),
    starMagicAttackPower: z.coerce.number().int().min(0).optional(),

    defense: z.coerce.number().int().min(0).optional(),
    flameDefense: z.coerce.number().int().min(0).optional(),
    starDefense: z.coerce.number().int().min(0).optional(),

    /* ------------ mobility ------------ */
    jump: z.coerce.number().int().min(0).optional(),
    flameJump: z.coerce.number().int().min(0).optional(),
    starJump: z.coerce.number().int().min(0).optional(),

    speed: z.coerce.number().int().min(0).optional(),
    flameSpeed: z.coerce.number().int().min(0).optional(),
    starSpeed: z.coerce.number().int().min(0).optional(),

    /* ------------ percentage lines (stored as strings in Prisma) ------------ */
    allStat: z.coerce.number().min(0).optional(),
    flameAllStat: z.coerce.number().min(0).optional(),
    starAllStat: z.coerce.number().min(0).optional(),

    bossDamage: z.coerce.number().min(0).optional(),
    flameBossDamage: z.coerce.number().min(0).optional(),
    starBossDamage: z.coerce.number().min(0).optional(),

    ignoreEnemyDefense: z.coerce.number().min(0).optional(),
    flameIgnoreEnemyDefense: z.coerce.number().min(0).optional(),

    /* ------------ optional JSON block ------------ */
    potential: z.string().optional(), // raw JSON string typed into a <textarea>
})

export type GearSchema = z.infer<typeof gearSchema>
