'use client'

import { Button } from '@/components/ui/button'
import { equipGear } from '@/lib/equipGear'
import { getQueryClient } from '@/lib/get-query-client'
import { Character, GearItem } from '@prisma/client'
import React from 'react'
import { useQueryClient } from '@tanstack/react-query'

type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}

export default function EquipGearButton({
	character,
	gear,
}: EquipGearButtonProps) {
	const queryClient = useQueryClient()
	// const queryClient = getQueryClient()
	return (
		<Button
			className='cursor-pointer w-full'
			onClick={async () => {
				const res = await equipGear({ character, gear })

				if (res.ok) {
					await queryClient.refetchQueries({
						queryKey: ['gears', character.name],
					})

					console.log(`Gear item ${gear.id} equipped successfully.`)
				} else {
					console.error(`Failed to equip gear ${gear.id}.`)
				}
			}}
		>
			Equip
		</Button>
	)
}
