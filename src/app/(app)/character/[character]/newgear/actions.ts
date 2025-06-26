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
import { GearItem } from '@prisma/client'

export async function createGearItem(formData: FormData, characterId: number) {
	/* 1. Zod validation ----------------------------------------------------- */
	const parsed = gearSchema.safeParse(Object.fromEntries(formData))
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
	const gearItemFlameScore = calculateFlameScore(character, data as GearItem)

	/* 4. Persist ------------------------------------------------------------ */
	const newItem = await prisma.gearItem.create({
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
			isEquipped: 'notEquipped',
			slot: '1',
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
			baseMaxHP: Number(data.baseMaxHP) ?? null,
			flameMaxHP: Number(data.flameMaxHP) ?? null,
			starMaxHP: Number(data.starMaxHP) ?? null,

			totalMaxMP:
				Number(data.baseMaxMP) +
				Number(data.flameMaxMP) +
				Number(data.starMaxMP),
			baseMaxMP: Number(data.baseMaxMP) ?? null,
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

			/* ─── defense ───────────────────────────────────── */
			baseDefense: null,
			flameDefense: null,
			starDefense: null,

			/* ─── mobility ───────────────────────────────────── */
			baseJump: null,
			flameJump: null,
			starJump: null,

			baseSpeed: null,
			flameSpeed: null,
			starSpeed: null,

			/* ─── percentage-based lines (Strings in Prisma) ─── */
			baseAllStat: Number(data.baseAllStat) ?? undefined,
			flameAllStat: Number(data.flameAllStat) ?? undefined,

			baseBossDamage: Number(data.baseBossDamage) ?? undefined,
			flameBossDamage: Number(data.flameBossDamage) ?? undefined,

			totalFlameScore: gearItemFlameScore ?? 0,

			baseIgnoreEnemyDefense: Number(data.baseIgnoreEnemyDefense) ?? undefined,
			flameIgnoreEnemyDefense:
				Number(data.flameIgnoreEnemyDefense) ?? undefined,

			potType1: data.potType1 ?? undefined,
			potType2: data.potType2 ?? undefined,
			potType3: data.potType3 ?? undefined,
			potValue1: data.potValue1 ?? undefined,
			potValue2: data.potValue2 ?? undefined,
			potValue3: data.potValue3 ?? undefined,
		},
	})

	/* 5. Redirect – Next will client-navigate automatically ---------------- */
	await refreshCharacterFlameScore(character.id)

	revalidatePath(`/character/${character.name}`)
	redirect(`/character/${character.name}`)
	return { success: true }
}
