import React from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import EditCharacterForm from './EditCharacterForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function page({
	params,
}: {
	params: Promise<{ character: string }>
}) {
	const { character } = await params

	//check to see if the user loged in
	const { userId } = await auth()
	if (!userId) {
		return <div>Not logged in</div>
	}

	//get the userId from the auth
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId }, // e.g. “clerkId” is a string column
		select: { id: true, email: true },
	})
	if (!internalUser) redirect('/') // first-time users
	// console.log('internalUser', internalUser)

	// check to see if the character exists
	// this should also check if the character belongs to the user
	const characterData = await prisma.character.findFirst({
		where: { name: character, userId: internalUser.id },
		select: {
			id: true,
			name: true,
			level: true,
			class: true,
			combatPower: true,
			arcaneForce: true,
			sacredPower: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	if (!characterData) {
		return <div>Character not found</div>
	}

	return (
		<div className='flex justify-center flex-col mx-auto max-w-xl'>
			<div className='mb-4'>
				<Link href={`/character/${characterData.name}`}>
					<Button className='cursor-pointer'>back to character</Button>
				</Link>
			</div>

			<EditCharacterForm
				character={character}
				characterId={characterData.id}
				characterData={characterData}
			/>
		</div>
	)
}
