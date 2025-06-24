import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Character, GearItem } from '@prisma/client'
import EquipGearButton from '../EquipGearButton/EquipGearButton'
import UnequipGearButton from '../UnequipGearButton/UnequipGearButton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DeleteGearButton } from '../DeleteGearButton/DeleteGearButton'
import { SignedIn } from '@clerk/nextjs'

type GearCardProps = {
	character: Character
	data: GearItem
	equiped: boolean
}

export default function GearCard({ character, data, equiped }: GearCardProps) {
	return (
		<Card className='w-full max-w-lg text-md mx-auto justify-between'>
			<Link
				href={`/character/${character.name}/${data.id}`}
				className='cursor-pointer'
			>
				<CardHeader className='text-center'>
					<CardTitle className='text-xl'>{data.name}</CardTitle>
					<CardDescription>
						{data.type} • {data.rarity}
						{data.tradeStatus !== 'untradeable' && ` • ${data.tradeStatus}`}
					</CardDescription>
					<div>
						{/* {data.starForce > 0 && (
						<p className='mt-1 font-xs flex-wrap flex'>
							{'★ '.repeat(data.starForce)}
						</p>
					)} */}
						<p>
							StarForce: {data.starForce} - Req Lvl: {data.requiredLevel}
						</p>
					</div>
				</CardHeader>

				<CardContent className='grid grid-cols-1 gap-x-3 text-xs'>
					<p> Type: {data.type}</p>
					<p>
						<span className='text-sky-500'>STR : {data.totalLuk}</span>

						<span className='text-sky-500'> DEX : {data.totalLuk}</span>
					</p>
					<p>
						<span className='text-sky-500'>INT : {data.totalLuk}</span>

						<span className='text-sky-500'> LUK : {data.totalLuk}</span>
					</p>
					<p>
						<span className='text-sky-500'>
							Attack Power : {data.totalAttackPower} Magic Attack :{' '}
							{data.totalMagicAttackPower}{' '}
						</span>
					</p>
					<p>
						<span className='text-sky-500'></span>
					</p>
					<p>
						<span className='text-sky-500'>
							{data.totalAllStat ? (
								<span> All Stat : {data.totalAllStat}% </span>
							) : (
								<span> All Stat : 0% </span>
							)}
						</span>
					</p>
					<p className='text-green-500'>-Potentials-</p>
					<p>{data.potType1 ? `${data.potType1} : ${data.potValue1}` : ''}</p>
					<p>{data.potType2 ? `${data.potType2} : ${data.potValue2}` : ''}</p>
					<p>{data.potType3 ? `${data.potType3} : ${data.potValue3}` : ''}</p>

					<p>Flame Score: {data.totalFlameScore}</p>
				</CardContent>
			</Link>
			<SignedIn>
				<CardFooter className='flex flex-col w-full justify-between gap-4'>
					<Button variant='default' className='cursor-pointer w-full' asChild>
						<Link href={`/character/${character.name}/editgear/${data.id}`}>
							Edit Gear
						</Link>
					</Button>
					{equiped ? (
						<UnequipGearButton character={character} gear={data} />
					) : (
						<EquipGearButton character={character} gear={data} />
					)}
					<DeleteGearButton gearItem={data} characterName={character.name} />
				</CardFooter>
			</SignedIn>
		</Card>
	)
}
