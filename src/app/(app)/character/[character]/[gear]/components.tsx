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
	const gearItem = data.gears.find(
		(gear: GearItem) => gear.id === Number(gearId)
	)
	if (!gearItem) {
		return <p>Gear item not found.</p>
	}
	return (
		<div className='max-w-4xl mx-auto'>
			{/* back to character button */}
			<ViewGear {...gearItem} />
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
	return (
		<img
			src={`${gearItem.url}`}
			alt={`Gear Image for ${characterName}`}
			className='max-w-full h-auto rounded-lg shadow-lg mx-auto'
		/>
	)
}
