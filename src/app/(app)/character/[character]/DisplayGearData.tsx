'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getGears } from './actions'
import { Character, GearItem } from '@prisma/client'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DeleteCharacterButton, DeleteGearButton, GearSlot } from './components'

type Props = { characterName: string }

export default function DisplayGearData({ characterName }: Props) {
	const [unequipedGears, setUnequipedGears] = useState<GearItem[]>([])
	const [equipedGears, setEquipedGears] = useState<GearItem[]>([])
	const { userId } = useAuth()
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})

	useEffect(() => {
		// Set unequipped gears when data is loaded
		setEquipedGears(data.gears.filter((gear) => gear.isEquipped === 'equipped'))
		setUnequipedGears(
			data.gears.filter((gear) => gear.isEquipped === 'notEquipped')
		)
	}, [data])
	if (isLoading) {
		return <p>Loading...</p>
	}
	if (isError) {
		return <p>Error loading characters.</p>
	}

	const gearBySlot: Record<string, GearItem | null> = Object.fromEntries(
		data.gears.map((g: GearItem) => [g.slot, g])
	)

	return (
		<>
			<div className='mx-auto max-w-4xl px-6 py-12 space-y-4'>
				<div className='grid md:grid-cols-2'>
					<CharacterInfo
						characterProp={data.character}
						userId={userId}
						internalUser={data.internalUser}
					/>
					<GearSlot characterName={characterName} />
				</div>

				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{equipedGears.map((gear) => (
						<div
							key={gear.id}
							className=' relative rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-md flex flex-col'
						>
							<Link
								href={`/character/${characterName}/${gear.id}`}
								className='absolute inset-0  cursor-pointer'
								aria-label={`view ${gear.name}`}
							/>

							<div>
								<div className='flex-1'>
									<h2 className='mb-2 text-lg font-semibold'>{gear.name}</h2>
									<p className='text-sm text-gray-600'>Type: {gear.type}</p>
									<p className='text-sm text-gray-600'>
										Star Force: {gear.starForce}
									</p>
									<p className='text-sm text-gray-600'>
										Str: {gear.totalStr ?? 0} | Dex: {gear.totalDex ?? 0} | Int:{' '}
										{gear.totalInt ?? 0} | Luk: {gear.totalLuk ?? 0}
									</p>
									<p className='text-sm text-gray-600'>
										All stat: {gear.flameAllStat ?? 0}%
									</p>
									<p className='text-sm text-gray-600'>
										Attack Power: {gear.totalAttackPower ?? 0} | Magic Attack
										Power: {gear.totalMagicAttackPower ?? 0}
									</p>
								</div>
								<div className='flex mt-4 relative z-10 gap-4'>
									{data.internalUser &&
									userId === String(data.internalUser.clerkId) ? (
										<Button
											variant='default'
											className='cursor-pointer'
											asChild
										>
											<Link
												href={`/character/${characterName}/editgear/${gear.id}`}
											>
												Edit Gear
											</Link>
										</Button>
									) : null}
									{data.internalUser &&
									userId === String(data.internalUser.clerkId) ? (
										<DeleteGearButton
											gearItem={gear}
											characterName={characterName}
										/>
									) : null}
								</div>
							</div>
						</div>
					))}
				</div>
				<div>
					<h2 className='text-xl font-semibold mt-8'>Unequipped Gear</h2>
					<p className='text-sm text-gray-600 mb-4'>
						These gears are not currently equipped.
					</p>
				</div>
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{unequipedGears.length !== 0 &&
						unequipedGears.map((gear) => (
							<div
								key={gear.id}
								className=' relative rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-md flex flex-col'
							>
								<Link
									href={`/character/${characterName}/${gear.id}`}
									className='absolute inset-0  cursor-pointer'
									aria-label={`view ${gear.name}`}
								/>

								<div>
									<div className='flex-1'>
										<h2 className='mb-2 text-lg font-semibold'>{gear.name}</h2>
										<p className='text-sm text-gray-600'>Type: {gear.type}</p>
										<p className='text-sm text-gray-600'>
											Star Force: {gear.starForce}
										</p>
										<p className='text-sm text-gray-600'>
											Str: {gear.totalStr ?? 0} | Dex: {gear.totalDex ?? 0} |
											Int: {gear.totalInt ?? 0} | Luk: {gear.totalLuk ?? 0}
										</p>
										<p className='text-sm text-gray-600'>
											All stat: {gear.flameAllStat ?? 0}%
										</p>
										<p className='text-sm text-gray-600'>
											Attack Power: {gear.totalAttackPower ?? 0} | Magic Attack
											Power: {gear.totalMagicAttackPower ?? 0}
										</p>
									</div>
									<div className='flex mt-4 relative z-10 gap-4'>
										{data.internalUser &&
										userId === String(data.internalUser.clerkId) ? (
											<Button
												variant='default'
												className='cursor-pointer'
												asChild
											>
												<Link
													href={`/character/${characterName}/editgear/${gear.id}`}
												>
													Edit Gear
												</Link>
											</Button>
										) : null}
										{data.internalUser &&
										userId === String(data.internalUser.clerkId) ? (
											<DeleteGearButton
												gearItem={gear}
												characterName={characterName}
											/>
										) : null}
									</div>
								</div>
							</div>
						))}
				</div>
				{data.internalUser && userId === String(data.internalUser.clerkId) ? (
					<Link href={`/character/${characterName}/newgearplus`}>
						<Button className='mt-4 cursor-pointer'>+ Add New Gear </Button>
					</Link>
				) : null}
			</div>
		</>
	)
}

function CharacterInfo({
	characterProp,
	userId,
	internalUser,
}: {
	characterProp: Character
	userId: string | null | undefined
	internalUser: { id: number; email: string; clerkId: string } | null
}) {
	return (
		<div className='rounded-xl border border-gray-200 bg-white p-8 shadow h-fit'>
			<h1 className='text-3xl font-bold'>{characterProp.name}</h1>
			<dl className='mt-4 space-y-1 text-gray-700'>
				<div>
					<dt className='inline font-medium'>Level:</dt>{' '}
					<dd className='inline'>{characterProp.level}</dd>
				</div>
				<div>
					<dt className='inline font-medium'>Class:</dt>{' '}
					<dd className='inline'>{characterProp.class}</dd>
				</div>
				<div>
					<dt className='inline font-medium'>Combat Power:</dt>{' '}
					<dd className='inline'>
						{characterProp.combatPower.toLocaleString()}
					</dd>
				</div>
				<div>
					<dt className='inline font-medium'>Flame Score:</dt>{' '}
					<dd className='inline'>
						{characterProp.totalFlameScore.toLocaleString()}
					</dd>
				</div>
				{internalUser && userId === String(internalUser.clerkId) ? (
					<div className='mt-4'>
						<Button>
							<Link href={`/character/${characterProp.name}/edit-character`}>
								Edit Character
							</Link>
						</Button>

						<DeleteCharacterButton characterName={characterProp.name} />
					</div>
				) : null}
			</dl>
		</div>
	)
}
