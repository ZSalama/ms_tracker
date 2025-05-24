import { z } from 'zod'

export const gearSchema = z.object({
    /* ------------ basic meta ------------ */
    name: z.string().min(1, 'Name is required').max(100),
    type: z.string().min(1),
    rarity: z.string().min(1),
    tradeStatus: z.string().optional(),
    starForce: z.coerce.number().int().optional(),

    attackPowerIncrease: z.coerce.number().int(),
    combatPowerIncrease: z.coerce.number().int(),
    requiredLevel: z.coerce.number().int(),

    isEquipped: z.coerce.boolean().optional(),

    /* ------------ core stats ------------ */
    str: z.coerce.number().int().optional(),
    flameStr: z.coerce.number().int().optional(),
    starStr: z.coerce.number().int().optional(),

    dex: z.coerce.number().int().optional(),
    flameDex: z.coerce.number().int().optional(),
    starDex: z.coerce.number().int().optional(),

    int: z.coerce.number().int().optional(),
    flameInt: z.coerce.number().int().optional(),
    starInt: z.coerce.number().int().optional(),

    luk: z.coerce.number().int().optional(),
    flameLuk: z.coerce.number().int().optional(),
    starLuk: z.coerce.number().int().optional(),

    /* ------------ HP / MP ------------ */
    maxHP: z.coerce.number().int().optional(),
    flameMaxHP: z.coerce.number().int().optional(),
    starMaxHP: z.coerce.number().int().optional(),

    maxMP: z.coerce.number().int().optional(),
    flameMaxMP: z.coerce.number().int().optional(),
    starMaxMP: z.coerce.number().int().optional(),

    /* ------------ attack / magic / defense ------------ */
    attackPower: z.coerce.number().int().optional(),
    flameAttackPower: z.coerce.number().int().optional(),
    starAttackPower: z.coerce.number().int().optional(),

    magicAttackPower: z.coerce.number().int().optional(),
    flameMagicAttackPower: z.coerce.number().int().optional(),
    starMagicAttackPower: z.coerce.number().int().optional(),

    /* ------------ percentage lines (stored as strings in Prisma) ------------ */
    allStat: z.coerce.number().int().optional(),
    flameAllStat: z.coerce.number().int().optional(),
    starAllStat: z.coerce.number().int().optional(),

    bossDamage: z.coerce.number().int().optional(),
    flameBossDamage: z.coerce.number().int().optional(),
    starBossDamage: z.coerce.number().int().optional(),

    ignoreEnemyDefense: z.coerce.number().int().optional(),
    flameIgnoreEnemyDefense: z.coerce.number().int().optional(),

    /* ------------ optional JSON block ------------ */
    potential: z.string().optional(),
})

export type GearSchema = z.infer<typeof gearSchema>
