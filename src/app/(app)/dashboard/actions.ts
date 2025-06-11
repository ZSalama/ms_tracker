'use server'
import { prisma } from '@/lib/prisma' // Import your Prisma client instance
import { auth } from '@clerk/nextjs/server'
import { queryOptions } from '@tanstack/react-query'
import { Character } from '@prisma/client'

type GetCharactersResponse = {
	internalUser: {
		id: number
		email: string
	}
	characters: Character[]
}

export async function getCharacters(): Promise<GetCharactersResponse> {
	const { userId } = await auth()
	if (!userId) {
		throw new Error('UNAUTHENTICATED')
	}
	/* 2️⃣  Internal user */
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: { id: true, email: true },
	})
	if (!internalUser) {
		throw new Error('UNAUTHENTICATED')
	}
	const characters = await prisma.character.findMany({
		where: { userId: internalUser.id },
		orderBy: { combatPower: 'desc' },
	})

	return { internalUser, characters }
}
