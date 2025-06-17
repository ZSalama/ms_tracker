import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { GearItem } from '@prisma/client'

export default function ViewGear(data: GearItem) {
	return (
		<Card className='w-full max-w-lg space-y-4 mx-auto'>
			{/* header ---------------------------------------------------------- */}
			<CardHeader className='text-center'>
				<CardTitle>{data.name}</CardTitle>
				<CardDescription>
					{data.type} • {data.rarity}
					{data.tradeStatus !== 'untradeable' && ` • ${data.tradeStatus}`}
				</CardDescription>
				<div>
					{data.starForce > 0 && (
						<p className='mt-1 font-medium'>{'★'.repeat(data.starForce)}</p>
					)}
					<p>StarForce: {data.starForce}</p>
				</div>

				{data.requiredLevel > 0 && (
					<p className='text-sm'>Req Lv {data.requiredLevel}</p>
				)}
				{data.isEquipped === 'equiped' && (
					<p className='text-green-600 text-sm'>Equipped</p>
				)}
			</CardHeader>
			<div className='w-fill border-gray-600 border-2 mx-6' />

			<CardContent className='grid grid-cols-1 gap-x-3 text-2xl'>
				<p> Type: {data.type}</p>
				<p>
					<span className='text-sky-500'>STR : {data.totalStr} </span>(
					{data.baseStr} +{' '}
					<span className='text-green-500'>{data.flameStr}</span> +{' '}
					<span className='text-amber-600'>{data.starStr}</span>)
				</p>
				<p>
					<span className='text-sky-500'>DEX : {data.totalDex} </span>(
					{data.baseDex} +{' '}
					<span className='text-green-500'>{data.flameDex}</span> +{' '}
					<span className='text-amber-600'>{data.starDex}</span>)
				</p>
				<p>
					<span className='text-sky-500'>INT : {data.totalInt} </span>(
					{data.baseInt} +{' '}
					<span className='text-green-500'>{data.flameInt}</span> +{' '}
					<span className='text-amber-600'>{data.starInt}</span>)
				</p>
				<p>
					<span className='text-sky-500'>LUK : {data.totalLuk} </span>(
					{data.baseLuk} +{' '}
					<span className='text-green-500'>{data.flameLuk}</span> +{' '}
					<span className='text-amber-600'>{data.starLuk}</span>)
				</p>
				<div className='w-fill border-gray-600 border-2 m-4' />
				<p>
					<span className='text-sky-500'>
						Attack Power : {data.totalAttackPower}{' '}
					</span>
					({data.baseAttackPower} +{' '}
					<span className='text-green-500'>{data.flameAttackPower}</span> +{' '}
					<span className='text-amber-600'>{data.starAttackPower}</span>)
				</p>
				<p>
					<span className='text-sky-500'>
						Magic Attack : {data.totalMagicAttackPower}{' '}
					</span>
					({data.baseMagicAttackPower} +{' '}
					<span className='text-green-500'>{data.flameMagicAttackPower}</span> +{' '}
					<span className='text-amber-600'>{data.starMagicAttackPower}</span>)
				</p>
				<p>
					<span className='text-sky-500'>All Stat : {data.totalAllStat}% </span>
					({data.baseAllStat} +{' '}
					<span className='text-green-500'>{data.flameAllStat}%</span>)
				</p>
				<div className='w-fill border-gray-600 border-2 m-4' />
				<p className='text-green-500'>Potential</p>
				<p>
					{data.potType1
						? `${data.potType1} : ${data.potValue1}`
						: 'No Potential 1'}
				</p>
				<p>
					{data.potType2
						? `${data.potType2} : ${data.potValue2}`
						: 'No Potential 2'}
				</p>
				<p>
					{data.potType3
						? `${data.potType3} : ${data.potValue3}`
						: 'No Potential 3'}
				</p>
				<div className='w-fill border-gray-600 border-2 m-4' />
				<p>Flame Score: {data.totalFlameScore}</p>
			</CardContent>
		</Card>
	)
}
