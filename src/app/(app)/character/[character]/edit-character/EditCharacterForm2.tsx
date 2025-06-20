'use client'
import { getCharacters } from '@/app/(app)/dashboard/actions'
import CharacterForm from '@/components/forms/character/character'
import { Character } from '@prisma/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

export default function EditCharacterForm2({
	character,
}: {
	character: string
}) {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['characters'],
		queryFn: getCharacters,
	})

	const specificCharacter = data.characters.filter(
		(c) => String(c.name) === character
	)[0]

	return (
		<CharacterForm
			props={{
				submissionType: 'edit',
				character: specificCharacter as Character,
			}}
		/>
	)
}
