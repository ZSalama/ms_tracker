'use server'

import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Character, GearItem } from '@prisma/client'
import { getQueryClient } from '@/lib/get-query-client'
import { refreshCharacterFlameScore } from '@/lib/calculateFlames'

export async function deleteGearAction(
	gearItem: GearItem,
	characterName: string
) {
	const { userId: clerkId } = await auth()
	if (!clerkId) throw new Error('Unauthenticated')
	const queryClient = getQueryClient()

	// verify character ownership
	const character = await prisma.character.findFirst({
		where: { name: characterName },
		select: { id: true, name: true, userId: true, user: true, class: true },
	})
	if (!character) throw new Error('Character not found')

	// verify logged-in user owns the character
	if (character.user.clerkId !== clerkId) throw new Error('Not authorized')

	// Perform delete
	await prisma.gearItem.delete({ where: { id: gearItem.id } })

	console.log(`Gear item with ID ${gearItem.id} deleted successfully.`)

	// Refresh character's flame score
	if (gearItem.isEquipped === 'equipped')
		await refreshCharacterFlameScore(character.id)
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
	redirect(`/dashboard`)
}

type GetGearsResponse = {
	character: Character
	gears: GearItem[]
	internalUser: {
		id: number
		email: string
		clerkId: string
	} | null
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

	// verify logged-in user owns the character
	const { userId: clerkId } = await auth()
	let internalUser = null
	if (clerkId) {
		internalUser = await prisma.user.findUnique({
			where: { clerkId: clerkId },
			select: { id: true, email: true, clerkId: true },
		})
	}

	// get gear from character
	const gears = await prisma.gearItem.findMany({
		where: { characterId: character.id },
		orderBy: { combatPowerIncrease: 'desc' },
	})

	return {
		character: character,
		gears: gears,
		internalUser: internalUser,
	}
}
