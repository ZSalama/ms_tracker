'use client'

import { Button } from '@/components/ui/button'
// import { Button } from '@/components/ui/button'
import { deleteGearAction, getGears } from './actions'
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
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'
import ViewGear from '@/components/ViewGear/ViewGear'
import { slotNames } from '@/lib/types'

export function DeleteGearButton({
	gearItem,
	characterName,
}: {
	gearItem: GearItem
	characterName: string
}) {
	const queryClient = useQueryClient()
	const { mutate, isPending } = useMutation({
		mutationFn: (payload: GearItem) => deleteGearAction(payload, characterName),
		onSuccess: () => {
			// instantly mark the query stale in the browser
			queryClient.invalidateQueries({ queryKey: ['gears', characterName] }) // :contentReference[oaicite:1]{index=1}
		},
	})
	return (
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
						{gearItem.name} and remove the data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='cursor-pointer'>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className='cursor-pointer'
						onClick={() => {
							console.log(`Delete gear: ${gearItem.name}`)
							mutate(gearItem)
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
		<div className='w-[325px] h-[500px] relative mx-auto'>
			<Image
				src='/blank_ui.PNG'
				height={300}
				width={300}
				alt='background'
				className=' object-contain opacity-90 pointer-events-none select-none rounded-lg'
			/>
			<div className='absolute inset-0 z-10 grid grid-cols-5  pt-15 pl-5 pr-11 h-[383px]'>
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
	if (isLoading || isError) {
		return <></>
	}

	const specificGear = data.gears.filter((g) => g.slot === slot)[0]

	return (
		<div>
			{slot !== '' ? (
				<Tooltip disableHoverableContent>
					<TooltipTrigger asChild>
						{specificGear?.id !== undefined ? (
							<a
								href={`/character/${characterName}/${specificGear?.id}`}
								/* base (mobile) = disabled ; ≥ md = active               */
								className={`
									relative size-12 rounded-md border bg-[rgba(255,255,255,0.05)]
									grid place-content-center overflow-hidden
									pointer-events-none          md:pointer-events-auto
									cursor-default               md:hover:cursor-pointer
									md:hover:ring-2 md:hover:ring-sky-400
								`}
								aria-disabled='true' /* helps screen readers on mobile */
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
							</a>
						) : (
							<a
								href={`/character/${characterName}/newgearplus`}
								/* base (mobile) = disabled ; ≥ md = active               */
								className={`
									relative size-12 rounded-md border bg-[rgba(255,255,255,0.05)]
									grid place-content-center overflow-hidden
									pointer-events-none          md:pointer-events-auto
									cursor-default               md:hover:cursor-pointer
									md:hover:ring-2 md:hover:ring-sky-400
								`}
								aria-disabled='true' /* helps screen readers on mobile */
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
							</a>
						)}
					</TooltipTrigger>
					{specificGear ? (
						<TooltipContent className='' side='left'>
							<ViewGear {...specificGear} />
						</TooltipContent>
					) : (
						<></>
					)}
				</Tooltip>
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className='relative size-12 rounded-md border
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
							className='max-w-[16rem] space-y-1  bg-slate-900 text-slate-100'
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
