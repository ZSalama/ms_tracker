'use client'
import { type Character, type GearItem } from '@prisma/client'
import ViewGear from '@/components/ViewGear/ViewGear'
import { Button } from '@/components/ui/button'
import { calculateSlotAndEquip, equipGear } from '@/lib/equipGear'
import { redirect } from 'next/navigation'
import { getQueryClient } from '@/lib/get-query-client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getGears } from '../../actions'
import Link from 'next/link'

type Props = { gear: GearItem }

// export function GearItemCard({ gear }: Props) {
// 	return <ViewGear {...gear} />
// }

type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}
export function EquipGearButton({ character, gear }: EquipGearButtonProps) {
	// const queryClient = getQueryClient()
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
				onClick={() => {
					calculateSlotAndEquip({ character, gear })
					// queryClient.invalidateQueries({
					// 	queryKey: ['gears', character.name],
					// }) // Invalidate the character query to refresh data
					redirect(`/character/${character.name}`) // Redirect to character page after equipping
				}}
				className='cursor-pointer w-full my-3'
			>
				Equip Gear
			</Button>
		</>
	)
}

type ViewGearContainerProps = { characterName: string; gearId: string }

export function ViewGearContainer({
	characterName,
	gearId,
}: ViewGearContainerProps) {
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
		<div className='max-w-4xl mx-auto'>
			{/* back to character button */}
			<ViewGear {...specificGear[0]} />
		</div>
	)
}
