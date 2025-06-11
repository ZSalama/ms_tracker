'use server'

import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { GearItem } from '@prisma/client'

export async function deleteGearAction(
	gearId: number,
	gearName: string,
	characterName: string
) {
	const { userId: clerkId } = await auth()
	if (!clerkId) throw new Error('Unauthenticated')

	// verify gear exists
	const geardb = await prisma.gearItem.findUnique({
		where: { id: gearId },
		include: { character: { select: { userId: true } } },
	})
	if (!geardb) throw new Error('Gear not found')

	// verify character ownership
	const character = await prisma.character.findFirst({
		where: { name: characterName },
		select: { id: true, name: true, userId: true, user: true },
	})
	if (!character) throw new Error('Character not found')

	// verify logged-in user owns the character
	if (character.user.clerkId !== clerkId) throw new Error('Not authorized')

	// Perform delete
	await prisma.gearItem.delete({ where: { id: gearId } })

	console.log(`Gear item with ID ${gearId} deleted successfully.`)

	// Redirect back to character page
	revalidatePath(`/character/${characterName}`)
	redirect(`/character/${characterName}`)
}

export async function deleteCharacterAction(characterName: string) {
	const { userId: clerkId } = await auth()
	if (!clerkId) throw new Error('Unauthenticated')

	// verify character exists
	const character = await prisma.character.findFirst({
		where: { name: characterName },
		select: { id: true, name: true, userId: true, user: true },
	})
	if (!character) throw new Error('Character not found')

	// verify logged-in user owns the character
	if (character.user.clerkId !== clerkId) throw new Error('Not authorized')

	// Perform delete
	await prisma.character.delete({ where: { id: character.id } })
	console.log(`Character ${characterName} deleted successfully.`)

	// Redirect to dashboard
	revalidatePath(`/dashboard`)
	redirect(`/dashboard`)
}

type GetGearsResponse = {
	gears: GearItem[]
}

export async function getGears(
	characterName: string
): Promise<GetGearsResponse> {
	// get character from database
	const character = await prisma.character.findFirst({
		where: { name: characterName },
	})
	if (!character) {
		throw new Error('Character not found')
	}

	// get gear from character
	const gears = await prisma.gearItem.findMany({
		where: { characterId: character.id },
		orderBy: { combatPowerIncrease: 'desc' },
	})

	return { gears: gears }
}
