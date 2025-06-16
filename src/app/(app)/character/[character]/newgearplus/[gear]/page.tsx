import React from 'react'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { gearSchema } from '@/lib/validators/gear'
import { EquipGearButton, GearItemCard, ViewGearContainer } from './components'
import {
	calculateFlameScore,
	refreshCharacterFlameScore,
} from '@/lib/calculateFlames'
import { GearItem, Potential } from '@prisma/client'
import ViewGear from '@/components/ViewGear/ViewGear'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { getGears } from '../../actions'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const secondaryNames = [
	'Ring',
	'Face Accessory',
	'Eye Accessory',
	'Earrings',
	'Shoulder',
	'Gloves',
	'Weapon',
	'Secondary',
	'Hat',
	'Cape',
	'Shoes',
	'Top',
	'Bottom',
	'Pendant',
	'Mechanical Heart',
	'Belt',
	'Emblem',
	'Pocket Item',
]

type GearWithPotential = GearItem & {
	potential1: Potential
	potential2: Potential
	potential3: Potential
}

export default async function page({
	params,
}: {
	params: Promise<{ character: string; gear: string; fastAnalysis: boolean }>
}) {
	const queryClient = getQueryClient()
	const { character, gear, fastAnalysis } = await params
	let data: any = {}
	// get gear data from the database

	const gearData = await prisma.gearItem.findFirst({
		where: { id: Number(gear) },
	})
	if (!gearData) {
		return <div>Gear not found</div>
	}
	const characterData = await prisma.character.findFirst({
		where: { name: character },
	})
	if (!characterData) {
		throw new Error('Character not found')
	}

	// 1️⃣ Run OpenAI here
	let analysis = ''

	if (!gearData.url) {
		return <div> there was an issue </div>
	}
	let completion: any = null
	if (gearData.fastAnalysis === 'fast') {
		completion = await openai.chat.completions.create({
			model: 'gpt-4o', // change to 'gpt-4o-mini' if accuracy improves
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content: `You are a MapleStory gear-OCR assistant.
		            TASK
		            Extract every visible stat from the supplied gear screenshot.
		            Return **only** a single JSON object whose keys exactly match the list below (no extra keys, no explanatory text).
		            Use plain integers (no thousands separators).
		            If a field is missing in the image, set its value to null.
		            Never guess: if you cannot read a number confidently, use null.
		            EXPECTED KEYS
		            name, type, rarity, tradeStatus,
		            starForce, // starforce is the number of star icons shown at the top - e.g. "21" for 21 stars
		            attackPowerIncrease, combatPowerIncrease, requiredLevel,
		            // the following stats are always shown in this order: 'Stat: totalStat (baseStat + flameStat + starStat)'
		            totalStr, baseStr, flameStr, starStr,
		            totalDex, baseDex, flameDex, starDex,
		            totalInt, baseInt, flameInt, starInt,
		            totalLuk, baseLuk, flameLuk, starLuk,
		            totalAttackPower, baseAttackPower, flameAttackPower, StarAttackPower,
		            totalMagicAttackPower, baseMagicAttackPower, flameMagicAttackPower, starMagicAttackPower,
		            totalBossDamage, baseBossDamage, flameBossDamage,
		            totalIgnoreEnemyDefense, baseIgnoreEnemyDefense, flameIgnoreEnemyDefense,
		            totalAllStat, baseAllStat, flameAllStat, // baseAllStat is always 0%, flameAllStat is the percentage inside parenthesis. remove the % sign.
		            potential1,   // an object with 2 properties (key, value) The first potential line, eg {"INT": "+6%"} If the gear has no potential, set potential1, potential2, potential3 to null. If the gear has only one potential line, set potential2 and potential3 to null. If the gear has two potential lines, set potential3 to null.
					potential2,   // an object with 2 properties (key, value) The second potential line, eg {"All Stat": "+2%"}
	 				potential3,    // an object with 2 properties (key, value) The first potential line, eg {"INT": "+6%"}
		            Example output (format, not values):
		            {
		            "name": "Silver Blossom Ring",
		            "type": "Ring",
		            "rarity": "Epic",
		            "tradeStatus": "untradeable",
		            "starForce": 12,
		            "attackPowerIncrease": 0,
		            "combatPowerIncrease": 4382,
		            "requiredLevel": 100,
		            "totalStr": 100, "baseStr": 30, "flameStr": 20, "starStr": 50,
		            "totalDex": 70,  "baseDex": 30, "flameDex": 10, "starDex": 30,
		            "totalInt": 272, "baseInt": 40, "flameInt": 102, "starInt": 130,
		            "totalLuk": 50,  "baseLuk": 30, "flameLuk": 0,  "starLuk": 20,
		            "totalAttackPower": 0, "baseAttackPower": 0, "flameAttackPower": 0, "starAttackPower": 0,
		            "totalMagicAttackPower": 0, "baseMagicAttackPower": 0, "flameMagicAttackPower": 0, "starMagicAttackPower": 0,
		            "totalBossDamage": 0, "baseBossDamage": 0, "flameBossDamage": 0,
		            "totalIgnoreEnemyDefense": 0, "baseIgnoreEnemyDefense": 0, "flameIgnoreEnemyDefense": 0,
		            "totalAllStat": 6, "baseAllStat": 0, "flameAllStat": 6,
					"potential1": {"INT", "+6%"}, 
	 				"potential2": {"All Stat", "+2%"},
	   				"potential3": {"INT", "+6%"}
					}
					`,
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'Here is the gear screenshot. Follow the rules above strictly and reply with the JSON object only.',
						},
						{ type: 'image_url', image_url: { url: gearData.url } },
					],
				},
			],
		})
	} else {
		completion = await openai.chat.completions.create({
			model: 'o3', // change to 'gpt-4o-mini' if accuracy improves
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content: `You are a MapleStory gear-OCR assistant.
		            TASK
		            Extract every visible stat from the supplied gear screenshot.
		            Return **only** a single JSON object whose keys exactly match the list below (no extra keys, no explanatory text).
		            Use plain integers (no thousands separators).
		            If a field is missing in the image, set its value to null.
		            Never guess: if you cannot read a number confidently, use null.
		            EXPECTED KEYS
		            name, type, rarity, tradeStatus,
		            starForce, // starforce is the number of star icons shown at the top - e.g. "21" for 21 stars
		            attackPowerIncrease, combatPowerIncrease, requiredLevel,
		            // the following stats are always shown in this order: 'Stat: totalStat (baseStat + flameStat + starStat)'
		            totalStr, baseStr, flameStr, starStr,
		            totalDex, baseDex, flameDex, starDex,
		            totalInt, baseInt, flameInt, starInt,
		            totalLuk, baseLuk, flameLuk, starLuk,
		            totalAttackPower, baseAttackPower, flameAttackPower, StarAttackPower,
		            totalMagicAttackPower, baseMagicAttackPower, flameMagicAttackPower, starMagicAttackPower,
		            totalBossDamage, baseBossDamage, flameBossDamage,
		            totalIgnoreEnemyDefense, baseIgnoreEnemyDefense, flameIgnoreEnemyDefense,
		            totalAllStat, baseAllStat, flameAllStat, // baseAllStat is always 0%, flameAllStat is the percentage inside parenthesis. remove the % sign.
		            potential1,   // an object with 2 properties (key, value) The first potential line, eg {"INT": "+6%"} If the gear has no potential, set potential1, potential2, potential3 to null. If the gear has only one potential line, set potential2 and potential3 to null. If the gear has two potential lines, set potential3 to null.
					potential2,   // an object with 2 properties (key, value) The second potential line, eg {"All Stat": "+2%"}
	 				potential3,    // an object with 2 properties (key, value) The first potential line, eg {"INT": "+6%"}
		            Example output (format, not values):
		            {
		            "name": "Silver Blossom Ring",
		            "type": "Ring",
		            "rarity": "Epic",
		            "tradeStatus": "untradeable",
		            "starForce": 12,
		            "attackPowerIncrease": 0,
		            "combatPowerIncrease": 4382,
		            "requiredLevel": 100,
		            "totalStr": 100, "baseStr": 30, "flameStr": 20, "starStr": 50,
		            "totalDex": 70,  "baseDex": 30, "flameDex": 10, "starDex": 30,
		            "totalInt": 272, "baseInt": 40, "flameInt": 102, "starInt": 130,
		            "totalLuk": 50,  "baseLuk": 30, "flameLuk": 0,  "starLuk": 20,
		            "totalAttackPower": 0, "baseAttackPower": 0, "flameAttackPower": 0, "starAttackPower": 0,
		            "totalMagicAttackPower": 0, "baseMagicAttackPower": 0, "flameMagicAttackPower": 0, "starMagicAttackPower": 0,
		            "totalBossDamage": 0, "baseBossDamage": 0, "flameBossDamage": 0,
		            "totalIgnoreEnemyDefense": 0, "baseIgnoreEnemyDefense": 0, "flameIgnoreEnemyDefense": 0,
		            "totalAllStat": 6, "baseAllStat": 0, "flameAllStat": 6,
					"potential1": {"INT", "+6%"}, 
	 				"potential2": {"All Stat", "+2%"},
	   				"potential3": {"INT", "+6%"}
					}
					`,
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'Here is the gear screenshot. Follow the rules above strictly and reply with the JSON object only.',
						},
						{ type: 'image_url', image_url: { url: gearData.url } },
					],
				},
			],
		})
	}

	analysis = completion.choices?.[0]?.message?.content ?? ''
	console.log('OpenAI analysis:', analysis)

	const analysisJson = JSON.parse(analysis)
	// validate type name and set to 'Secondary' if not in the list
	if (!secondaryNames.includes(analysisJson.type)) {
		analysisJson.type = 'Secondary'
	}

	const parsed = gearSchema.safeParse(analysisJson)
	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors }
	}
	data = parsed.data

	// Update gearData with the analysis
	const updatedFlameScore = calculateFlameScore(characterData, data)
	data.totalFlameScore = updatedFlameScore

	// create potentials

	const [key1, val1] = analysisJson.potential1
		? (Object.entries(analysisJson.potential1)[0] as [string, string])
		: []
	const potential1 = await prisma.potential.create({
		data: {
			type: key1,
			value: typeof val1 === 'string' ? val1 : undefined,
		},
	})

	const [key2, val2] = analysisJson.potential2
		? (Object.entries(analysisJson.potential2)[0] as [string, string])
		: []
	const potential2 = await prisma.potential.create({
		data: {
			type: key2,
			value: typeof val2 === 'string' ? val2 : undefined,
		},
	})

	const [key3, val3] = analysisJson.potential3
		? (Object.entries(analysisJson.potential3)[0] as [string, string])
		: []
	const potential3 = await prisma.potential.create({
		data: {
			type: key3,
			value: typeof val3 === 'string' ? val3 : undefined,
		},
	})

	const updatedGear = await prisma.gearItem.update({
		where: { id: gearData.id },
		data: {
			name: data.name ?? gearData.name,
			type: data.type ?? gearData.type,
			rarity: data.rarity ?? 'Unknown',
			tradeStatus: data.tradeStatus ?? 'untradeable',
			starForce: data.starForce ?? 0,
			attackPowerIncrease: data.attackPowerIncrease ?? 0,
			combatPowerIncrease: data.combatPowerIncrease ?? 0,
			requiredLevel: data.requiredLevel ?? 0,
			totalStr: data.totalStr ?? 0,
			baseStr: data.baseStr ?? 0,
			flameStr: data.flameStr ?? 0,
			starStr: data.starStr ?? 0,
			totalDex: data.totalDex ?? 0,
			baseDex: data.baseDex ?? 0,
			flameDex: data.flameDex ?? 0,
			starDex: data.starDex ?? 0,
			totalInt: data.totalInt ?? 0,
			baseInt: data.baseInt ?? 0,
			flameInt: data.flameInt ?? 0,
			starInt: data.starInt ?? 0,
			totalLuk: data.totalLuk ?? 0,
			baseLuk: data.baseLuk ?? 0,
			flameLuk: data.flameLuk ?? 0,
			starLuk: data.starLuk ?? 0,
			totalAttackPower: data.totalAttackPower ?? 0,
			baseAttackPower: data.baseAttackPower ?? 0,
			flameAttackPower: data.flameAttackPower ?? 0,
			starAttackPower: data.starAttackPower ?? 0,
			totalMagicAttackPower: data.totalMagicAttackPower ?? 0,
			baseMagicAttackPower: data.baseMagicAttackPower ?? 0,
			flameMagicAttackPower: data.flameMagicAttackPower ?? 0,
			starMagicAttackPower: data.starMagicAttackPower ?? 0,
			totalAllStat: data.baseAllStat ?? 0,
			flameAllStat: data.flameAllStat ?? 0,
			totalFlameScore: data.totalFlameScore,
			potential1: potential1 ? { connect: { id: potential1.id } } : undefined,
			potential2: potential2 ? { connect: { id: potential2.id } } : undefined,
			potential3: potential3 ? { connect: { id: potential3.id } } : undefined,
		},
	})
	if (!updatedGear) {
		throw new Error('Failed to update gear with OpenAI analysis')
	}
	// Refresh the character's flame score
	await refreshCharacterFlameScore(characterData.id)

	void queryClient.prefetchQuery({
		queryKey: ['gears', character],
		queryFn: () => getGears(character),
	})

	return (
		<>
			<h1 className='max-w-4xl text-center text-4xl font-bold m-8 flex items-center justify-center mx-auto '>
				<Link href={`/character/${character}`}>
					<Button className='cursor-pointer flex relative '>
						View Character
					</Button>
				</Link>
				<p className='line-clamp-1 mx-auto'>
					{character}&apos;s {gearData.name} {/* include item name */}
				</p>
			</h1>

			<div className='max-w-4xl mx-auto py-4 space-y-10 grid grid-cols-2'>
				<div className='text-center'>
					<img
						src={gearData.url ?? '/placeholder.png'}
						alt={gearData.name}
						width={400}
						height={200}
						className={'rounded-lg'}
					/>
				</div>

				<div>
					<HydrationBoundary state={dehydrate(queryClient)}>
						<ViewGearContainer
							characterName={character}
							gearId={String(gear)}
						/>
					</HydrationBoundary>

					<EquipGearButton character={characterData} gear={updatedGear} />
				</div>
			</div>
		</>
	)
}
