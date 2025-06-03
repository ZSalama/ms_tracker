'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { characterSchema } from '@/lib/validators/character'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function editCharacterItem(
	formData: FormData,
	characterId: number
) {
	// console.log('createGearItem', formData)
	/* 1. Clerk auth --------------------------------------------------------- */
	const { userId: clerkId } = await auth()
	if (!clerkId) throw new Error('Unauthenticated')

	/* 2. Zod validation ----------------------------------------------------- */
	const parsed = characterSchema.safeParse(Object.fromEntries(formData))
	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors }
	}
	const data = parsed.data

	// get internal user from the database
	const internalUser = await prisma.user.findUnique({
		where: { clerkId }, // e.g. “clerkId” is a string column
		select: { id: true, email: true },
	})
	if (!internalUser) {
		redirect('/')
	}

	console.log(
		`User ${internalUser.email} is editing character with ID ${characterId}`
	)
	/* 3. Get Character Data ----------------------------------------- */
	const character = await prisma.character.findFirst({
		where: { id: characterId },
		select: { id: true, name: true, userId: true }, // need more fields?
	})

	if (!character) redirect('/')

	// check to see if the character belongs to the user
	if (character.userId !== internalUser.id) {
		alert('You do not have permission to edit this character.')
		redirect('/dashboard')
	}

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
