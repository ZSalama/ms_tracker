import ViewGear from '@/components/ViewGear/ViewGear'
import { prisma } from '@/lib/prisma'
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

	return <ViewGear {...gearData} />
}
