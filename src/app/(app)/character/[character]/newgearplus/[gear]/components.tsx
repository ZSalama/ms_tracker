'use client'
import { type Character, type GearItem } from '@prisma/client'
import ViewGear from '@/components/ViewGear/ViewGear'
import { Button } from '@/components/ui/button'
import {
	calculateFlameScore,
	refreshCharacterFlameScore,
} from '@/lib/calculateFlames'
import { prisma } from '@/lib/prisma'
import { equipGear } from '@/lib/equipGear'

type Props = { gear: GearItem }

export function GearItemCard({ gear }: Props) {
	return <ViewGear {...gear} />
}

type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}
export function EquipGearButton({ character, gear }: EquipGearButtonProps) {
	if (!character || !gear) {
		return <div>Character or gear not found</div>
	}

	return (
		<Button
			onClick={() => {
				equipGear({ character, gear })
			}}
			className='cursor-pointer'
		>
			Equip Gear
		</Button>
	)
}
