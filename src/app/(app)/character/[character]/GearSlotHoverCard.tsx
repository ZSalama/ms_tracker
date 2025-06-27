'use client'

import { getGears } from './actions'
import { GearItem } from '@prisma/client'
import { useSuspenseQuery } from '@tanstack/react-query'

import {
	HoverCard,
	HoverCardTrigger,
	HoverCardContent,
} from '@/components/ui/hover-card'

import Image from 'next/image'
import { slotNames } from '@/types/slotNames'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import GearCard from '@/components/gear/GearCard/GearCard'

type GearSlotProps = {
	characterName: string
}

export function GearSlot({ characterName }: GearSlotProps) {
	const { data } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})

	const gearBySlot: Record<string, GearItem | null> = Object.fromEntries(
		data.gears.map((g: GearItem) => [g.slot, g])
	)

	return (
		<div className='w-[325px] h-[500px] relative mx-auto'>
			<Image
				src='/blank_ui.PNG'
				height={300}
				width={300}
				alt='background'
				className='object-contain opacity-90 select-none rounded-2xl'
			/>
			<div className='absolute inset-0 z-10 grid grid-cols-5 pt-16 pl-5 pr-11 h-[381px]'>
				{slotNames.map((slot, index) => (
					<GearSlotCard
						key={index}
						slot={slot}
						gear={gearBySlot[slot]}
						characterName={characterName}
					/>
				))}
			</div>
		</div>
	)
}

type GearSlotCardProps = {
	slot: string
	gear: GearItem | null
	characterName: string
}

function GearSlotCard({ gear, slot, characterName }: GearSlotCardProps) {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	const [open, setOpen] = React.useState(false)
	if (isLoading || isError) return null

	const specificGear = data.gears.find((g) => g.slot === slot)

	const SlotBox = React.forwardRef<
		HTMLButtonElement,
		React.ComponentPropsWithoutRef<typeof Button> & { content: React.ReactNode }
	>(({ content, className, ...props }, ref) => (
		<Button
			ref={ref}
			className={cn(
				'relative size-12 rounded-md border bg-background/30 grid place-content-center',
				className
			)}
			{...props}
		>
			{content}
		</Button>
	))
	SlotBox.displayName = 'SlotBox' // 👈 keep React DevTools happy

	const EmptyContent = (
		<span className='text-[10px] text-gray-400 tracking-tight'>{slot}</span>
	)

	const GearImg = (
		<Image
			// src='/weapon.png'
			src={`/${slot}.png` || 'weapon.PNG'} // Fallback to gloves if no image
			alt={gear?.name || ''}
			fill
			className='object-contain pointer-events-none'
			sizes='56px'
		/>
	)

	// ─────────────────────────────────────────────────────────────

	return (
		<div>
			{slot !== '' ? (
				<HoverCard
					openDelay={0}
					closeDelay={0}
					onOpenChange={setOpen}
					open={open}
				>
					<HoverCardTrigger
						asChild
						onMouseEnter={() => setOpen(true)} // show on hover
						onMouseLeave={() => setOpen(false)} // hide when leaving TRIGGER
						onFocus={() => setOpen(true)} // keep keyboard support
						onBlur={() => setOpen(false)}
					>
						<Button
							variant='ghost'
							className='relative size-12 rounded-md border bg-background/30
               grid place-content-center hover:cursor-pointer'
							onClick={() => console.log(slot, specificGear?.name)}
						>
							{specificGear ? GearImg : EmptyContent}
						</Button>
					</HoverCardTrigger>

					{specificGear && (
						<HoverCardContent side='right' className='z-50 pointer-events-none'>
							{/* <ViewGear {...specificGear} /> */}
							<GearCard
								data={specificGear}
								character={data.character}
								equiped={true}
								view='minimal'
							/>
						</HoverCardContent>
					)}
				</HoverCard>
			) : (
				<HoverCard>
					<HoverCardTrigger asChild>
						<div className='relative size-12 rounded-md border bg-[rgba(255,255,255,0.05)] hover:ring-2 grid place-content-center overflow-hidden'>
							{specificGear ? (
								<Image
									src='/gloves.PNG'
									alt={gear?.name || ''}
									fill
									className='object-contain'
									sizes='56px'
								/>
							) : (
								EmptyContent
							)}
						</div>
					</HoverCardTrigger>

					{specificGear && (
						<HoverCardContent
							side='right'
							className='max-w-[16rem] z-50 space-y-1 bg-slate-900 text-slate-100'
						>
							<p className='font-semibold text-sm leading-tight'>
								{specificGear.name}
							</p>
							<p className='text-xs text-muted-foreground'>
								{specificGear.starForce}★ · {specificGear.rarity}
							</p>
							<ul className='mt-1 text-xs grid gap-[2px]'>
								<li>INT {specificGear.totalInt}</li>
								<li>LUK {specificGear.totalLuk}</li>
								<li>Magic ATK {specificGear.totalMagicAttackPower}</li>
							</ul>
						</HoverCardContent>
					)}
				</HoverCard>
			)}
		</div>
	)
}
