import { Button } from '@/components/ui/button'
import ViewGear from '@/components/ViewGear/ViewGear'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
// import { GearItem } from '@prisma/client'
import React from 'react'

export default async function viewgear({
	params,
}: {
	params: Promise<{ gear: string }>
}) {
	const props = await params
	const gearData = await prisma.gearItem.findFirst({
		where: { id: Number(props.gear) },
	})
	if (!gearData) {
		return <div>Gear not found</div>
	}
	const characterId = await prisma.character.findFirst({
		where: { id: gearData.characterId },
		select: { name: true },
	})
	if (!characterId) {
		return <div>Character not found</div>
	}

	return (
		<div className='max-w-4xl mx-auto'>
			{/* back to character button */}
			<Link href={`/character/${characterId.name}`}>
				{' '}
				<Button className='cursor-pointer'>Back to Character</Button>
			</Link>
			<ViewGear {...gearData} />
		</div>
	)
}
