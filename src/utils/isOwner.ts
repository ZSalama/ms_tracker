'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export default async function IsOwner(characterName: string) {
	const { userId } = await auth()
	if (!userId) {
		return false
	}
	if (!characterName) {
		return false
	}
	// Check if the userId matches the characterName
	const characterNameFromDB = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: { characters: { select: { name: true } } },
	})
	const specificCharacter = characterNameFromDB?.characters.find(
		(character) => character.name === characterName
	)
	if (!specificCharacter) {
		return false
	} else if (specificCharacter.name === characterName) {
		return true
	}
	return false
}
