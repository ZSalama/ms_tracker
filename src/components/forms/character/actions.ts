'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { characterSchema } from '@/lib/validators/character'
import { redirect } from 'next/navigation'
import { classStats } from '@/lib/types'

export async function createCharacter(
	formData: FormData,
	submissionType: string
) {
	const parsed = characterSchema.safeParse(
		Object.fromEntries(formData.entries())
	)
	if (!parsed.success) {
		// Bubble the zod errors back to the form
		return { error: parsed.error.flatten().fieldErrors }
	}
	const { userId } = await auth()
	if (!userId) redirect('/dashboard/sign-in') // not signed in ⇒ bounce

	/* 2️⃣  Look up the *internal* User row tied to that Clerk user.  
		 ▸ Adjust where() if you store the Clerk ID differently. */
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId }, // e.g. “clerkId” is a string column
		select: { id: true },
	})
	if (!internalUser) redirect('/')

	/* 2️⃣  Look up the *internal* User row tied to that Clerk user.  
         ▸ Adjust where() if you store the Clerk ID differently. */
	const specificCharacter = await prisma.user.findUnique({
		where: { clerkId: userId }, // e.g. “clerkId” is a string column
		select: {
			characters: { select: { id: true }, where: { name: parsed.data.name } },
		},
	})

	if (!specificCharacter) return { error: 'No character found to update.' }

	const mainStat = classStats[parsed.data.class].main || 'int'
	const subStat = classStats[parsed.data.class].sub || 'luk'
	const attackType = classStats[parsed.data.class].attackType || 'Attack'

	if (submissionType === 'create') {
		await prisma.character.create({
			data: {
				...parsed.data,
				userId: internalUser.id,
				flameWeightAttackType: attackType,
				flameWeightMainType: mainStat,
				flameWeightSubType: subStat,
				// flameWeightAllStat: parsed.data.flameWeightAllStat || 1,
			},
		})
		redirect('/dashboard')
	} else if (submissionType === 'edit') {
		await prisma.character.update({
			where: { id: specificCharacter.characters[0].id }, // Update the first character
			data: {
				/* ─── linkage & meta ─────────────────────────────── */
				// characterId: character.id,
				level: parsed.data.level,
				class: parsed.data.class,
				combatPower: parsed.data.combatPower,
				arcaneForce: parsed.data.arcaneForce,
				sacredPower: parsed.data.sacredPower,
				// totalFlameScore: data.totalFlameScore,
			},
		})
		redirect(`/character/${parsed.data.name}`)
	}

	// Refresh any page that reads the character list
	return { success: true }
}
