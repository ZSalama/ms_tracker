'use server'

import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Character, GearItem } from '@prisma/client'
import { GearWithPotential } from '@/lib/types'

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
	redirect(`/dashboard`)
}

type GetGearsResponse = {
	character: Character
	gears: GearWithPotential[]
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
		include: {
			potential1: { select: { type: true, value: true } }, // "key", "val"
			potential2: { select: { type: true, value: true } },
			potential3: { select: { type: true, value: true } },
		},
	})

	const gearsWithPotentials = gears.map((gear) => ({
		...gear,
		potential1: gear.potential1
			? { id: gear.potential1Id!, ...gear.potential1 }
			: { id: 0, type: '', value: '' },
		potential2: gear.potential2
			? { id: gear.potential2Id!, ...gear.potential2 }
			: { id: 0, type: '', value: '' },
		potential3: gear.potential3
			? { id: gear.potential3Id!, ...gear.potential3 }
			: { id: 0, type: '', value: '' },
	}))
	return {
		character: character,
		gears: gearsWithPotentials,
		internalUser: internalUser,
	}
}
