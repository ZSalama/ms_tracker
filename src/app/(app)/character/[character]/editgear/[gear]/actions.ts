'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { gearSchema } from '@/lib/validators/gear'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
	calculateFlameScore,
	refreshCharacterFlameScore,
} from '@/lib/calculateFlames'
import { getQueryClient } from '@/lib/get-query-client'
import { equipGear } from '@/lib/equipGear'
import { GearItem } from '@prisma/client'
import { GearWithPotential } from '@/lib/types'

export async function editGearItem(
	formData: FormData,
	characterId: number,
	gearId: number
) {
	const queryClient = getQueryClient()

	//* 2. Zod validation ----------------------------------------------------- */

	const raw = Object.fromEntries(formData) as Record<string, any>

	// collect *.type / *.value pairs and build nested objects
	;['potential1', 'potential2', 'potential3'].forEach((k) => {
		const type = raw[`${k}.type`]
		const value = raw[`${k}.value`]

		if (type !== undefined || value !== undefined) {
			// create the nested object Zod expects
			raw[k] = { type, value }
		}
		delete raw[`${k}.type`]
		delete raw[`${k}.value`]
	})

	const parsed = gearSchema.safeParse(raw)
	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors }
	}
	const data = parsed.data

	/* 2. Clerk auth --------------------------------------------------------- */
	const { userId: clerkId } = await auth()
	if (!clerkId) throw new Error('Unauthenticated')

	/* 3. Character ownership check ----------------------------------------- */
	const character = await prisma.character.findFirst({
		where: { id: characterId },
	})

	const internalUser = await prisma.user.findFirst({
		where: { clerkId: clerkId },
		select: { id: true },
	})

	if (!character) {
		throw new Error('Character not found')
	}
	if (character.userId !== internalUser?.id) {
		throw new Error('You do not own this character')
	}

	const gearItemFlameScore = calculateFlameScore(character, data)
	// considered refactoring lots of code because of this next line
	// like any function that interacts with updating gear should only require the most minimal data
	// like id if it wants to update the gear instead of recasting an entire object that requires type imports..
	const gearData = { id: gearId, ...parsed.data } as GearItem
	if (data.isEquipped === 'equipped') {
		await equipGear({
			character: character,
			gear: gearData, // cast to GearItem for equipGear function
		})
	}

	/* 4. Persist ------------------------------------------------------------ */
	const gear = await prisma.gearItem.update({
		where: { id: Number(gearId) },
		data: {
			/* ─── linkage & meta ─────────────────────────────── */
			// characterId: character.id,
			character: { connect: { id: character.id } },
			name: data.name,
			type: data.type,
			rarity: data.rarity,
			tradeStatus: 'untradeable',
			starForce: Number(data.starForce),
			requiredLevel: Number(data.requiredLevel),
			isEquipped: data.isEquipped,

			/* ─── progression bonuses ────────────────────────── */
			attackPowerIncrease: Number(data.attackPowerIncrease),
			combatPowerIncrease: Number(data.combatPowerIncrease),

			/* ─── main stats ─────────────────────────────────── */
			totalStr:
				Number(data.baseStr) + Number(data.flameStr) + Number(data.starStr),
			baseStr: Number(data.baseStr) ?? 0,
			flameStr: Number(data.flameStr) ?? null,
			starStr: Number(data.starStr) ?? null,

			totalDex:
				Number(data.baseDex) + Number(data.flameDex) + Number(data.starDex),
			baseDex: Number(data.baseDex) ?? 0,
			flameDex: Number(data.flameDex) ?? null,
			starDex: Number(data.starDex) ?? null,

			totalInt:
				Number(data.baseInt) + Number(data.flameInt) + Number(data.starInt),
			baseInt: Number(data.baseInt) ?? 0,
			flameInt: Number(data.flameInt) ?? null,
			starInt: Number(data.starInt) ?? null,

			totalLuk:
				Number(data.baseLuk) + Number(data.flameLuk) + Number(data.starLuk),
			baseLuk: Number(data.baseLuk) ?? 0,
			flameLuk: Number(data.flameLuk) ?? null,
			starLuk: Number(data.starLuk) ?? null,

			/* ─── HP / MP ────────────────────────────────────── */
			totalMaxHP:
				Number(data.baseMaxHP) +
				Number(data.flameMaxHP) +
				Number(data.starMaxHP),
			baseMaxHP: Number(data.baseMaxHP) ?? 0,
			flameMaxHP: Number(data.flameMaxHP) ?? null,
			starMaxHP: Number(data.starMaxHP) ?? null,

			totalMaxMP:
				Number(data.baseMaxMP) +
				Number(data.flameMaxMP) +
				Number(data.starMaxMP),
			baseMaxMP: Number(data.baseMaxMP) ?? 0,
			flameMaxMP: Number(data.flameMaxMP) ?? null,
			starMaxMP: Number(data.starMaxMP) ?? null,

			/* ─── offensive / defensive ──────────────────────── */
			totalAttackPower:
				Number(data.baseAttackPower) +
				Number(data.flameAttackPower) +
				Number(data.starAttackPower),
			baseAttackPower: Number(data.baseAttackPower) ?? 0,
			flameAttackPower: Number(data.flameAttackPower) ?? null,
			starAttackPower: Number(data.starAttackPower) ?? null,

			totalMagicAttackPower:
				Number(data.baseMagicAttackPower) +
				Number(data.flameMagicAttackPower) +
				Number(data.starMagicAttackPower),
			baseMagicAttackPower: Number(data.baseMagicAttackPower) ?? 0,
			flameMagicAttackPower: Number(data.flameMagicAttackPower) ?? null,
			starMagicAttackPower: Number(data.starMagicAttackPower) ?? null,

			totalDefense: null,
			baseDefense: null,
			flameDefense: null,
			starDefense: null,

			/* ─── mobility ───────────────────────────────────── */
			totalJump: null,
			baseJump: null,
			flameJump: null,
			starJump: null,

			totalSpeed: null,
			baseSpeed: null,
			flameSpeed: null,
			starSpeed: null,

			/* ─── percentage-based lines (Strings in Prisma) ─── */
			totalAllStat: Number(data.flameAllStat) ?? undefined,
			baseAllStat: 0,
			flameAllStat: Number(data.flameAllStat) ?? undefined,

			totalBossDamage:
				Number(data.baseBossDamage) + Number(data.flameBossDamage),
			baseBossDamage: Number(data.baseBossDamage) ?? 0,
			flameBossDamage: Number(data.flameBossDamage) ?? undefined,

			totalIgnoreEnemyDefense:
				Number(data.baseIgnoreEnemyDefense) +
				Number(data.flameIgnoreEnemyDefense),
			baseIgnoreEnemyDefense: Number(data.baseIgnoreEnemyDefense) ?? 0,
			flameIgnoreEnemyDefense:
				Number(data.flameIgnoreEnemyDefense) ?? undefined,

			totalFlameScore: gearItemFlameScore ?? 0,

			/* ─── JSON block ─────────────────────────────────── */
			// potential: data.potential ? JSON.parse(data.potential) : {},
			potential1: data.potential1
				? {
						upsert: {
							create: data.potential1,
							update: data.potential1,
						},
				  }
				: undefined,
			potential2: data.potential2
				? {
						upsert: {
							create: data.potential2,
							update: data.potential2,
						},
				  }
				: undefined,
			potential3: data.potential3
				? {
						upsert: {
							create: data.potential3,
							update: data.potential3,
						},
				  }
				: undefined,
		},
	})

	await refreshCharacterFlameScore(character.id)

	queryClient.invalidateQueries({ queryKey: ['gears'] })
	redirect(`/character/${character.name}`)
	return { success: true }
}
