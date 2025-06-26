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
	view?: 'default' | 'minimal'
}

export default function GearCard({
	character,
	data,
	equiped,
	view = 'default',
}: GearCardProps) {
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
							{data.starForce} Stars - Lvl: {data.requiredLevel}
						</p>
					</div>
				</CardHeader>

				<CardContent className='grid grid-cols-1 gap-x-3 text-xs mt-1'>
					<p> Type: {data.type}</p>
					<p>
						<span>STR : {data.totalStr}</span>

						<span> DEX : {data.totalDex}</span>
					</p>
					<p>
						<span> INT : {data.totalInt}</span>

						<span> LUK : {data.totalLuk}</span>
					</p>
					<p>
						<span>
							Att Power : {data.totalAttackPower} <br />
							Mat Attack : {data.totalMagicAttackPower}
						</span>
					</p>
					<p>
						<span>
							{data.totalAllStat ? (
								<span> All Stat : {data.totalAllStat}% </span>
							) : (
								<span> All Stat : 0% </span>
							)}
						</span>
					</p>
					<p className='text-center'> -Potentials-</p>
					<p>{data.potType1 ? `${data.potType1} : ${data.potValue1}` : ''}</p>
					<p>{data.potType2 ? `${data.potType2} : ${data.potValue2}` : ''}</p>
					<p>{data.potType3 ? `${data.potType3} : ${data.potValue3}` : ''}</p>

					<p>Flame Score: {data.totalFlameScore}</p>
				</CardContent>
			</Link>
			{view === 'default' ? (
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
			) : (
				<></>
			)}
		</Card>
	)
}
