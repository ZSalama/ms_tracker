'use client'
import ViewGear from '@/components/ViewGear/ViewGear'
import { GearItem } from '@prisma/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { getGears } from '../actions'

type Props = { characterName: string; gearId: string }

export function ViewGearContainer({ characterName, gearId }: Props) {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	if (isLoading) {
		return <p>Loading...</p>
	}
	if (isError) {
		return <p>Error loading characters.</p>
	}
	// find the specific gear item

	const specificGear = data.gears.filter((gear) => String(gear.id) === gearId)
	return (
		<div className=''>
			{/* back to character button */}
			<ViewGear {...specificGear[0]} />
		</div>
	)
}

export function ImageOfGear({ characterName, gearId }: Props) {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	if (isLoading) {
		return <p>Loading...</p>
	}
	if (isError) {
		return <p>Error loading characters.</p>
	}

	// find the specific gear item
	const gearItem = data.gears.find(
		(gear: GearItem) => gear.id === Number(gearId)
	)
	if (!gearItem) {
		return <p>Gear item not found.</p>
	}
	return gearItem.url ? (
		<img
			src={`${gearItem.url}`}
			alt={`Gear Image for ${characterName}`}
			className='max-w-full h-auto rounded-lg shadow-lg mx-auto'
		/>
	) : (
		<p className='max-w-full h-auto text-center'>
			No image available for this gear.
		</p>
	)
}
