import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { DeleteCharacterButton, DeleteGearButton } from './components'
import { Button } from '@/components/ui/button'
// import { unstable_cache } from 'next/cache'

// TODO: add auth guard once auth flow is set up
export default async function Page({
	params,
}: {
	params: Promise<{ character: string }>
}) {
	const { character } = await params
	const { userId } = await auth()

	// Fetch character data from Prisma with caching
	// const getCharacterData = unstable_cache(
	//     async () =>
	//         await prisma.character.findFirst({
	//             where: { name: character },
	//             select: {
	//                 id: true,
	//                 name: true,
	//                 level: true,
	//                 class: true,
	//                 combatPower: true,
	//                 user: true,
	//                 gears: {
	//                     select: {
	//                         id: true,
	//                         name: true,
	//                         type: true,
	//                         starForce: true,
	//                         combatPowerIncrease: true,
	//                         totalStr: true,
	//                         totalDex: true,
	//                         totalInt: true,
	//                         totalLuk: true,
	//                         flameAllStat: true,
	//                         totalAttackPower: true,
	//                         totalMagicAttackPower: true,
	//                     },
	//                 },
	//             },
	//         })
	// )
	// const characterData = await getCharacterData()

	const characterData = await prisma.character.findFirst({
		where: { name: character },
		select: {
			id: true,
			name: true,
			level: true,
			class: true,
			combatPower: true,
			user: true,
			gears: {
				select: {
					id: true,
					name: true,
					type: true,
					starForce: true,
					combatPowerIncrease: true,
					totalStr: true,
					totalDex: true,
					totalInt: true,
					totalLuk: true,
					flameAllStat: true,
					totalAttackPower: true,
					totalMagicAttackPower: true,
				},
			},
		},
	})

	if (!characterData) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<p className='text-xl font-semibold text-gray-700'>
					Character not found
				</p>
			</div>
		)
	}

	return (
		<div className='container mx-auto px-4 py-8 space-y-10'>
			<Suspense fallback={<Loading />}>
				<DisplayCharacterData characterProp={characterData} />
			</Suspense>

			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{characterData.gears.map((gear) => (
					<div
						key={gear.id}
						className='rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-md flex flex-col'
					>
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
								Attack Power: {gear.totalAttackPower ?? 0} | Magic Attack Power:{' '}
								{gear.totalMagicAttackPower ?? 0}
							</p>
						</div>
						<div>
							{userId === String(characterData.user.clerkId) ? (
								<Link href={`/character/${character}/editgear/${gear.id}`}>
									<Button className='mt-4 inline-block rounded-md border border-indigo-600 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 cursor-pointer bg-white'>
										Edit Gear
									</Button>
								</Link>
							) : null}
							{userId === String(characterData.user.clerkId) ? (
								<DeleteGearButton
									gearId={gear.id}
									gearName={gear.name}
									characterName={character}
								/>
							) : null}
						</div>
					</div>
				))}
			</div>
			{userId === String(characterData.user.clerkId) ? (
				<Link
					href={`/character/${character}/newgearplus`}
					className='inline-block mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 transition'
				>
					+ Add New Gear
				</Link>
			) : null}
		</div>
	)
}

function Loading() {
	return (
		<div className='flex items-center justify-center py-20'>
			<p className='animate-pulse text-gray-600'>Loading...</p>
		</div>
	)
}

type CharacterInfo = {
	id: number
	name: string
	level: number
	class: string
	combatPower: number
}

function DisplayCharacterData({
	characterProp,
}: {
	characterProp: CharacterInfo
}) {
	return (
		<div className='rounded-xl border border-gray-200 bg-white p-8 shadow'>
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
				<Button className='m-4 inline-block rounded-md border border-indigo-600 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 cursor-pointer bg-white'>
					<Link href={`/character/${characterProp.name}/edit-character`}>
						Edit Character
					</Link>
				</Button>
				{/* delete character */}
				<DeleteCharacterButton characterName={characterProp.name} />
			</dl>
		</div>
	)
}
