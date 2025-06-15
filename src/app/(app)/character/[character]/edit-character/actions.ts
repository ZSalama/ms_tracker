'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { characterSchema } from '@/lib/validators/character'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
	getCharacterFlameScore,
	refreshCharacterFlameScore,
} from '@/lib/calculateFlames'

export async function editCharacterItem(
	formData: FormData,
	characterId: number
) {
	// console.log('createGearItem', formData)/* 2. Zod validation ----------------------------------------------------- */
	const parsed = characterSchema.safeParse(Object.fromEntries(formData))
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
		select: { id: true, email: true },
	})

	if (!character) {
		throw new Error('Character not found')
	}
	if (character.userId !== internalUser?.id) {
		throw new Error('You do not own this character')
	}

	console.log(
		`User ${internalUser.email} is editing character with ID ${characterId}`
	)

	// calulate and update flame score
	const newFlameScore = await getCharacterFlameScore(characterId)
	console.log(
		`New flame score for character ${character.name} is ${newFlameScore}`
	)

	/* 4. Persist ------------------------------------------------------------ */
	await prisma.character.update({
		where: { id: Number(characterId) },
		data: {
			/* ─── linkage & meta ─────────────────────────────── */
			// characterId: character.id,
			level: data.level,
			class: data.class,
			combatPower: data.combatPower,
			arcaneForce: data.arcaneForce,
			sacredPower: data.sacredPower,
			totalFlameScore: newFlameScore,
		},
	})

	console.log(
		`Character ${character.name} updated by user ${internalUser.email}`
	)

	/* 5. Redirect – Next will client-navigate automatically ---------------- */
	revalidatePath(`/character/${character.name}`)
	redirect(`/character/${character.name}`)
	return { success: true }
}
