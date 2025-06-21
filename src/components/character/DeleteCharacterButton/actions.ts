'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

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
	try {
		await prisma.character.delete({ where: { id: character.id } })
		console.log(`Character ${characterName} deleted successfully.`)
		return { ok: true }
	} catch {
		console.error(`Failed to delete character ${characterName}.`)
		return { ok: false }
	}
}
