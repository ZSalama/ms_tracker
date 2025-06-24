'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getGears } from './actions'
import { GearItem } from '@prisma/client'
import { useAuth } from '@clerk/nextjs'
import { GearSlot } from './components'
import { CharacterCharacterInfo } from '@/components/character/DisplayCharacterInfo/DisplayCharacterInfo'
import GearCard from '@/components/gear/GearCard/GearCard'

type Props = { characterName: string }

export default function DisplayGearData({ characterName }: Props) {
	const [unequipedGears, setUnequipedGears] = useState<GearItem[]>([])
	const [equipedGears, setEquipedGears] = useState<GearItem[]>([])
	const { userId } = useAuth()
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})

	useEffect(() => {
		// Set unequipped gears when data is loaded
		setEquipedGears(data.gears.filter((gear) => gear.isEquipped === 'equipped'))
		setUnequipedGears(
			data.gears.filter((gear) => gear.isEquipped === 'notEquipped')
		)
	}, [data])
	if (isLoading) {
		return <p>Loading...</p>
	}
	if (isError) {
		return <p>Error loading characters.</p>
	}

	return (
		<>
			<div className='mx-auto max-w-4xl px-6 py-12 space-y-4'>
				<div className='grid md:grid-cols-2'>
					<div>
						<CharacterCharacterInfo
							characterProp={data.character}
							userId={userId}
							internalUser={data.internalUser}
						/>
					</div>

					<GearSlot characterName={characterName} />
				</div>

				<h2 className='text-xl font-semibold mt-8'>Equipped Gear</h2>
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{equipedGears.length !== 0
						? equipedGears.map((gear) => (
								<GearCard
									key={gear.id}
									data={gear}
									character={data.character}
									equiped={true}
								/>
						  ))
						: null}
				</div>
				<div>
					<h2 className='text-xl font-semibold mt-8'>Unequipped Gear</h2>
					<p className='text-sm text-gray-600 mb-4'>
						These gears are not currently equipped.
					</p>
				</div>
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{unequipedGears.length !== 0
						? unequipedGears.map((gear) => (
								<GearCard
									key={gear.id}
									data={gear}
									character={data.character}
									equiped={false}
								/>
						  ))
						: null}
				</div>
			</div>
		</>
	)
}
