'use client'
import { type GearItem } from '@prisma/client'
import ViewGear from '@/components/ViewGear/ViewGear'

type ViewGearContainerProps = { gear: GearItem }

export function ViewGearContainer({ gear }: ViewGearContainerProps) {
	// fetch gear data from chatgpt and display it
	if (!gear) {
		return <div>Gear not found</div>
	}

	return (
		<div className='max-w-4xl mx-auto'>
			{/* back to character button */}
			<ViewGear {...gear} />
		</div>
	)
}
