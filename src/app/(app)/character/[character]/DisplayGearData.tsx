'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { getGears } from './actions'

type Props = { characterName: string }

export default function DisplayGearData({ characterName }: Props) {
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
	// return <div>{data.gears[0].id}</div>
	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Gear Data for {characterName}</h2>
			<ul className='space-y-4'>
				{data.gears.map((gear) => (
					<li key={gear.id} className='p-4 border rounded-lg shadow-sm'>
						<h3 className='text-xl font-semibold'>{gear.name}</h3>
						<p>Type: {gear.type}</p>
						<p>Star Force: {gear.starForce}</p>
						<p>Combat Power Increase: {gear.combatPowerIncrease}</p>
						<p>Total STR: {gear.totalStr}</p>
						<p>Total DEX: {gear.totalDex}</p>
						<p>Total INT: {gear.totalInt}</p>
						<p>Total LUK: {gear.totalLuk}</p>
						<p>Flame All Stat: {gear.flameAllStat}</p>
						<p>Total Attack Power: {gear.totalAttackPower}</p>
						<p>Total Magic Attack Power: {gear.totalMagicAttackPower}</p>
					</li>
				))}
			</ul>
		</div>
	)
}
