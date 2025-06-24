'use client'

import { Button } from '@/components/ui/button'
import { equipGear, unequipGear } from '@/lib/equipGear'
import { Character, GearItem } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}

export default function UnequipGearButton({
	character,
	gear,
}: EquipGearButtonProps) {
	const queryClient = useQueryClient()
	return (
		<Button
			variant='secondary'
			className='cursor-pointer w-full '
			onClick={async () => {
				const res = await unequipGear({ character, gear })
				if (res.ok) {
					console.log('refteching queries')
					queryClient.refetchQueries({
						queryKey: ['gears', character.name],
					})
					console.log(`Gear item ${gear.id} equipped unequiped.`)
				} else {
					console.error(`Failed to equip gear ${gear.id}.`)
				}
			}}
		>
			Unequip
		</Button>
	)
}
