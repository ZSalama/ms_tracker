import React, { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { gearSchema } from '@/lib/validators/gear'
import { ViewGearContainer } from './components/ViewGearContainer'
import { EquipGearButton } from './components/EquipGearButton'
import {
	calculateFlameScore,
	refreshCharacterFlameScore,
} from '@/lib/calculateFlames'
import { GearItem } from '@prisma/client'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export default async function page({
	params,
}: {
	params: Promise<{ character: string; gear: string }>
}) {
	const { character, gear } = await params
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

	if (!gearData.url) {
		return <div> there was an issue </div>
	}
	const modelType = gearData.fastAnalysis === 'fast' ? 'gpt-4o' : 'o3'
	const completion = await openai.chat.completions.create({
		model: modelType, // change to 'gpt-4o-mini' if accuracy improves
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
		            potType1, potValue1   //  potType1 is type of the first line of the potentials and the value is the 2nd part, deliminated by the colon. If the gear has no potential, set potType1, potValue1, potType2, potValue2, potType3, potValue3 to null. If the gear has only one potential line, set potType2 and potType3 to null. If the gear has two potential lines, set potType3 and potValue3 to null.
					potType2, potValue2    // 2nd line of potentials
	 				potType3, potValue3    // 3rd line of potentials
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
					"potType1": "INT",
					"potValue1": "+6%",
					"potType2": "All Stat",
					"potValue2": "+2%",
					"potType3": "INT",
					"potValue3": "+6%",
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

	const analysis = completion.choices?.[0]?.message?.content ?? ''
	console.log('OpenAI analysis:', analysis)

	const analysisJson = JSON.parse(analysis)

	const parsed = gearSchema.safeParse(analysisJson)
	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors }
	}
	const data: GearItem = parsed.data as GearItem

	// Update gearData with the analysis
	const updatedFlameScore = calculateFlameScore(characterData, data)
	data.totalFlameScore = updatedFlameScore

	const updatedGear = await prisma.gearItem.update({
		where: { id: gearData.id },
		data: {
			name: data.name ?? gearData.name,
			type: data.type,
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

			potType1: data.potType1 ?? null,
			potValue1: data.potValue1 ?? null,

			potType2: data.potType2 ?? null,
			potValue2: data.potValue2 ?? null,

			potType3: data.potType3 ?? null,
			potValue3: data.potValue3 ?? null,
		},
	})
	if (!updatedGear) {
		throw new Error('Failed to update gear with OpenAI analysis')
	}
	// Refresh the character's flame score
	await refreshCharacterFlameScore(characterData.id)

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
					<Suspense fallback={<div>Loading gear data...</div>}>
						<ViewGearContainer gear={updatedGear} />

						<EquipGearButton character={characterData} gear={updatedGear} />
					</Suspense>
				</div>
			</div>
		</>
	)
}
