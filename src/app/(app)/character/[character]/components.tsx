'use client'

import { Button } from '@/components/ui/button'
// import { Button } from '@/components/ui/button'
import { deleteGearAction, deleteCharacterAction, getGears } from './actions'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { GearItem } from '@prisma/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'
import { HoverCard, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { HoverCardContent } from '@/components/ui/hover-card'
import { GearWithPotential } from '@/lib/types'

export function DeleteGearButton({
	gearId,
	gearName,
	characterName,
}: {
	gearId: number
	gearName: string
	characterName: string
}) {
	return (
		// <Button
		//     type='submit'
		//     className='mt-4 ml-4 rounded-md border border-red-600 px-3 py-1 text-sm font-medium bg-gray-200 text-red-600 hover:bg-red-50 cursor-pointer'
		//     onClick={() => {
		//         deleteGearAction(gearId, characterName)
		//     }}
		// >
		//     Delete Gear
		// </Button>
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive' className='cursor-pointer'>
					Delete Gear
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your{' '}
						{gearName} and remove the data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='cursor-pointer'>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className='cursor-pointer'
						onClick={() => {
							console.log(`Delete gear: ${gearName}`)
							deleteGearAction(gearId, gearName, characterName)
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function DeleteCharacterButton({
	characterName,
}: {
	characterName: string
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='cursor-pointer ml-5' variant='destructive'>
					Delete Character
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						character and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='cursor-pointer'>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className='cursor-pointer'
						onClick={() => {
							console.log(`Delete character: ${characterName}`)
							deleteCharacterAction(characterName)
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

type GearSlotProps = {
	characterName: string
}
export function GearSlot({ characterName }: GearSlotProps) {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	// const specificGear = data.gears.filter((g) => String(g.id === gear.id))
	// Map the API response into a record by slot name for quick lookup.
	const gearBySlot: Record<string, GearItem | null> = Object.fromEntries(
		data.gears.map((g: GearItem) => [g.slot, g])
	)

	return (
		<div className='w-[400px] h-[700px] relative mx-auto'>
			<Image
				src='/blank_ui.PNG'
				height={400}
				width={400}
				alt='background'
				className=' object-contain opacity-90 pointer-events-none select-none rounded-lg'
			/>
			<div className='absolute inset-0 z-10 grid grid-cols-5 gap-1 bg-gray-200/30 pt-22 px-7 pr-5 h-[507px]'>
				{[
					'ring1',
					'',
					'hat',
					'',
					'emblem',
					'ring1',
					'pendant1',
					'faceAccessory',
					'',
					'badge',
					'ring1',
					'pendant2',
					'eyeAccessory',
					'Earring',
					'medal',
					'ring1',
					'weapon',
					'top',
					'bottom',
					'shoulder',
					'subweapon',
					'pocket',
					'belt',
					'gloves',
					'cape',
					'',
					'',
					'Shoes',
					'android',
					'heart',
				].map((slot, index) => (
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
	if (isLoading || isError) {
		return <></>
	}
	// if (!gear) {
	// 	return <></>
	// }
	const specificGear = data.gears.filter((g) => g.slot === slot)[0]

	// const gearWithPotential = specificGear as GearWithPotential
	return (
		<div>
			{slot !== '' ? (
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className='relative size-14 rounded-md border
                     bg-[rgba(255,255,255,0.05)] hover:ring-2 hover:ring-sky-400
                     grid place-content-center overflow-hidden'
						>
							{specificGear ? (
								<Image
									src={'/Eqp_Fafnir_Battle_Cleaver.png'}
									alt={gear?.name || ''}
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
					{specificGear ? (
						<TooltipContent
							side='right'
							className='max-w-[16rem] space-y-1 bg-slate-900 text-slate-100'
						>
							<>
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
							</>
						</TooltipContent>
					) : (
						<></>
					)}
				</Tooltip>
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className='relative size-14 rounded-md border
                     bg-[rgba(255,255,255,0.05)] hover:ring-2 hover:ring-sky-400
                     grid place-content-center overflow-hidden'
						>
							{specificGear ? (
								<Image
									src={'/gloves.png'}
									alt={gear?.name || ''}
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

					{specificGear ? (
						<TooltipContent
							side='right'
							className='max-w-[16rem] space-y-1 bg-slate-900 text-slate-100'
						>
							<>
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
							</>
						</TooltipContent>
					) : (
						<></>
					)}
				</Tooltip>
			)}
		</div>
	)
}
