'use client'
import { type Character, type GearItem } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getQueryClient } from '@/lib/get-query-client'
type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}
export function EquipGearButton({ character, gear }: EquipGearButtonProps) {
	const queryClient = getQueryClient()
	if (!character || !gear) {
		return <div>Character or gear not found</div>
	}

	return (
		<>
			{/* link to character page */}
			<Link href={`/character/${character.name}`}>
				<Button className='w-full mt-4 cursor-pointer'>
					Back to character
				</Button>
			</Link>
			{/* link to edit gear page */}
			<Link href={`/character/${character.name}/editgear/${gear.id}`}>
				<Button className='w-full mt-4 cursor-pointer'>Edit Gear</Button>
			</Link>

			<Button
				onClick={async () => {
					// await calculateSlotAndEquip({ character, gear })
					queryClient.invalidateQueries({
						queryKey: ['gears', character.name],
					}) // Invalidate the character query to refresh data
					redirect(`/character/${character.name}`) // Redirect to character page after equipping
				}}
				className='cursor-pointer w-full my-3'
			>
				Equip Gear
			</Button>
		</>
	)
}
