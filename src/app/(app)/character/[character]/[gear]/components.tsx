'use client'
import ViewGear from '@/components/ViewGear/ViewGear'
import { GearItem, Potential } from '@prisma/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { getGears } from '../actions'
import { GearWithPotential } from '@/lib/types'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'

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

	const specificGear = data.gears.filter((gear) => String(gear.id) === gearId)
	return (
		<div className='max-w-4xl mx-auto'>
			{/* back to character button */}
			<ViewGear {...specificGear[0]} />
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
	return gearItem.url ? (
		<img
			src={`${gearItem.url}`}
			alt={`Gear Image for ${characterName}`}
			className='max-w-full h-auto rounded-lg shadow-lg mx-auto'
		/>
	) : (
		<p className='max-w-full h-auto text-center'>
			No image available for this gear.
		</p>
	)
}

type GearSlotProps = {
	characterName: string
	gearId: string
}
export function GearSlot({ characterName, gearId }: GearSlotProps) {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	const specificGear = data.gears.filter((gear) => String(gear.id) === gearId)
	// Map the API response into a record by slot name for quick lookup.
	const gearBySlot: Record<string, GearItem | null> = Object.fromEntries(
		data.gears.map((g: GearItem) => [g.type, g])
	)

	return (
		<div className='grid grid-cols-5 gap-1 bg-gray-200/60'>
			{[
				'ring1',
				'',
				'hat',
				'',
				'emblem',
				'ring1',
				'pendant1',
				'faceAccessory',
				'badge',
				'ring1',
				'pendant2',
				'eyeAccessory',
				'medal',
				'ring1',
				'weapon',
				'top',
				'shoulder',
				'subweapon',
				'pocket',
				'belt',
				'gloves',
				'cape',
				'',
				'',
				'shoes',
				'android',
				'heart',
			].map((slot, index) => (
				<GearSlotCard
					key={index}
					slot={slot}
					gearId={gearId}
					characterName={characterName}
				/>
			))}
		</div>
	)
}

type GearSlotCardProps = {
	slot: string
	gearId: string
	characterName: string
}
function GearSlotCard({ gearId, slot, characterName }: GearSlotCardProps) {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	const specificGear = data.gears.filter((gear) => String(gear.id) === gearId)
	// const gearWithPotential = specificGear as GearWithPotential[]
	return (
		<div>
			<Tooltip>
				{/* ---------- clickable / hoverable area ---------- */}
				<TooltipTrigger asChild>
					<div
						className='relative size-14 rounded-md border
                     bg-[rgba(255,255,255,0.05)] hover:ring-2 hover:ring-sky-400
                     grid place-content-center overflow-hidden'
					>
						{specificGear[0].url ? (
							<Image
								src='/blank_ui.PNG'
								alt={specificGear[0].name}
								fill
								className='object-contain'
								sizes='56px'
							/>
						) : (
							<span className='text-[10px] text-gray-400 tracking-tight'>
								{slot}
							</span>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent
					side='right'
					className='max-w-[16rem] space-y-1 bg-slate-900 text-slate-100'
				>
					{specificGear[0] ? (
						<>
							<p className='font-semibold text-sm leading-tight'>
								{specificGear[0].name}
							</p>
							<p className='text-xs text-muted-foreground'>
								{specificGear[0].starForce}★ · {specificGear[0].rarity}
							</p>
							<ul className='mt-1 text-xs grid gap-[2px]'>
								<li>INT {specificGear[0].totalInt}</li>
								<li>LUK {specificGear[0].totalLuk}</li>
								<li>Magic ATK {specificGear[0].totalMagicAttackPower}</li>
								{/* add more lines as desired */}
							</ul>
						</>
					) : (
						<p className='italic text-xs'>Empty slot</p>
					)}
				</TooltipContent>
			</Tooltip>
		</div>
	)
}
