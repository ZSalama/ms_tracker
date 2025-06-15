'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function addGearItemPlus(characterName: string, url: string) {
	/* 2. Clerk auth --------------------------------------------------------- */
	const { userId: clerkId } = await auth()
	if (!clerkId) throw new Error('Unauthenticated')

	const internalUser = await prisma.user.findFirst({
		where: { clerkId: clerkId },
		select: { id: true },
	})

	const character = await prisma.character.findFirst({
		where: { name: characterName },
		select: { id: true, name: true, userId: true },
	})
	if (!character) redirect('/')
	if (character.userId !== internalUser?.id) {
		throw new Error('You do not own this character')
	}

	/* 4. Persist ------------------------------------------------------------ */

	const gear = await prisma.gearItem.create({
		data: {
			/* ─── linkage & meta ─────────────────────────────── */
			// characterId: character.id,
			character: { connect: { id: character.id } },
			name: '',
			type: '',
			rarity: '',
			tradeStatus: 'untradeable',
			starForce: 0,
			requiredLevel: 0,
			isEquipped: 'unequipped',

			url: url,

			/* ─── progression bonuses ────────────────────────── */
			attackPowerIncrease: 0,
			combatPowerIncrease: 0,

			/* ─── main stats ─────────────────────────────────── */
			totalStr: 0,
			baseStr: 0,
			flameStr: 0,
			starStr: 0,

			totalDex: 0,
			baseDex: 0,
			flameDex: 0,
			starDex: 0,

			totalInt: 0,
			baseInt: 0,
			flameInt: 0,
			starInt: 0,

			totalLuk: 0,
			baseLuk: 0,
			flameLuk: 0,
			starLuk: 0,

			/* ─── HP / MP ────────────────────────────────────── */
			totalMaxHP: 0,
			baseMaxHP: 0,
			flameMaxHP: 0,
			starMaxHP: 0,

			totalMaxMP: 0,
			baseMaxMP: 0,
			flameMaxMP: 0,
			starMaxMP: 0,

			/* ─── offensive / defensive ──────────────────────── */
			totalAttackPower: 0,
			baseAttackPower: 0,
			flameAttackPower: 0,
			starAttackPower: 0,

			totalMagicAttackPower: 0,
			baseMagicAttackPower: 0,
			flameMagicAttackPower: 0,
			starMagicAttackPower: 0,

			totalDefense: 0,
			baseDefense: null,
			flameDefense: null,
			starDefense: null,

			/* ─── mobility ───────────────────────────────────── */
			totalJump: 0,
			baseJump: null,
			flameJump: null,
			starJump: null,

			totalSpeed: 0,
			baseSpeed: null,
			flameSpeed: null,
			starSpeed: null,

			/* ─── percentage-based lines (Strings in Prisma) ─── */
			totalAllStat: 0,
			baseAllStat: 0,
			flameAllStat: 0,

			totalBossDamage: 0,
			baseBossDamage: 0,
			flameBossDamage: 0,

			totalIgnoreEnemyDefense: 0,
			baseIgnoreEnemyDefense: 0,
			flameIgnoreEnemyDefense: 0,

			totalFlameScore: 0,

			/* ─── JSON block ─────────────────────────────────── */
			potential: {},
		},
	})

	/* 5. Redirect – Next will client-navigate automatically ---------------- */
	// revalidatePath(`/character/${character.name}`)
	redirect(`/character/${character.name}/newgearplus/${gear.id}`)

	return { success: true, gearId: gear.id }
}
