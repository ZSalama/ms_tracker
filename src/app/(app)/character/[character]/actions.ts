'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Character, GearItem } from '@prisma/client'

export type GetGearsResponse = {
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
