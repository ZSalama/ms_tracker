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

	isEquipped: z.coerce.string(),

	/* ------------ core stats ------------ */
	totalStr: z.coerce.number().int().optional(),
	baseStr: z.coerce.number().int().optional(),
	flameStr: z.coerce.number().int().optional(),
	starStr: z.coerce.number().int().optional(),

	totalDex: z.coerce.number().int().optional(),
	baseDex: z.coerce.number().int().optional(),
	flameDex: z.coerce.number().int().optional(),
	starDex: z.coerce.number().int().optional(),

	totalInt: z.coerce.number().int().optional(),
	baseInt: z.coerce.number().int().optional(),
	flameInt: z.coerce.number().int().optional(),
	starInt: z.coerce.number().int().optional(),

	totalLuk: z.coerce.number().int().optional(),
	baseLuk: z.coerce.number().int().optional(),
	flameLuk: z.coerce.number().int().optional(),
	starLuk: z.coerce.number().int().optional(),

	/* ------------ HP / MP ------------ */
	totalMaxHP: z.coerce.number().int().optional(),
	baseMaxHP: z.coerce.number().int().optional(),
	flameMaxHP: z.coerce.number().int().optional(),
	starMaxHP: z.coerce.number().int().optional(),

	totalMaxMP: z.coerce.number().int().optional(),
	baseMaxMP: z.coerce.number().int().optional(),
	flameMaxMP: z.coerce.number().int().optional(),
	starMaxMP: z.coerce.number().int().optional(),

	/* ------------ attack / magic / defense ------------ */
	totalAttackPower: z.coerce.number().int().optional(),
	baseAttackPower: z.coerce.number().int().optional(),
	flameAttackPower: z.coerce.number().int().optional(),
	starAttackPower: z.coerce.number().int().optional(),

	totalMagicAttackPower: z.coerce.number().int().optional(),
	baseMagicAttackPower: z.coerce.number().int().optional(),
	flameMagicAttackPower: z.coerce.number().int().optional(),
	starMagicAttackPower: z.coerce.number().int().optional(),

	/* ------------ percentage lines (stored as strings in Prisma) ------------ */
	totalAllStat: z.coerce.number().int().optional(),
	baseAllStat: z.coerce.number().int().optional(),
	flameAllStat: z.coerce.number().int().optional(),

	totalBossDamage: z.coerce.number().int().optional(),
	baseBossDamage: z.coerce.number().int().optional(),
	flameBossDamage: z.coerce.number().int().optional(),

	totalIgnoreEnemyDefense: z.coerce.number().int().optional(),
	baseIgnoreEnemyDefense: z.coerce.number().int().optional(),
	flameIgnoreEnemyDefense: z.coerce.number().int().optional(),

	/* ------------ optional JSON block ------------ */
	potential: z.string().optional(),
})

export type GearSchema = z.infer<typeof gearSchema>
