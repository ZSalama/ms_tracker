'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export default async function IsOwner(characterName: string) {
	console.log('Checking ownership for character:', characterName)
	const { userId } = await auth()
	if (!userId) {
		return false
	}
	if (!characterName) {
		return false
	}
	console.log('User ID:', userId)
	console.log('Character Name:', characterName)
	// Check if the userId matches the characterName
	const characterNameFromDB = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: { characters: { select: { name: true } } },
	})
	const specificCharacter = characterNameFromDB?.characters.find(
		(character) => character.name === characterName
	)
	console.log('Character Name from DB:', specificCharacter)
	if (!specificCharacter) {
		return false
	} else if (specificCharacter.name === characterName) {
		console.log('User is the owner of the character:', specificCharacter.name)
		return true
	}
	return false
}
