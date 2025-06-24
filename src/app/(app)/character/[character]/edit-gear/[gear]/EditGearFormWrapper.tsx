'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { getGears } from '../../actions'
import { EditGearForm } from '@/components/forms/gear/EditGearForm'

type Props = {
	characterName: string
	gearId: string
}

export default function EditGearFormWrapper(props: Props) {
	const { characterName, gearId } = props
	const { data } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	return (
		<EditGearForm data={data} gearId={gearId} characterName={characterName} />
	)
}
