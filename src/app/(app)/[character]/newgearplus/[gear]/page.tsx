import React from 'react'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import OpenAI from 'openai'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export default async function page({
    params,
}: {
    params: Promise<{ character: string; gear: number }>
}) {
    const { character, gear } = await params
    // get gear data from the database
    const gearData = await prisma.gearItem.findFirst({
        where: { id: Number(gear) },
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
            url: true,
        },
    })
    if (!gearData) {
        return <div>Gear not found</div>
    }
    // 1️⃣ Run OpenAI here
    let analysis = ''
    if (gearData.url) {
        const completion = await openai.chat.completions.create({
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
                    totalAllStat, baseAllStat, flameAllStat, // baseAllStat is always 0%, flameAllStat is the percentage inside parenthesis. remove the % sign.
                    potential   // JSON string of the item’s potential lines

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
                    "potential": "{\"line1\":\"+6% INT\",\"line2\":\"+6% INT\",\"line3\":\"+2% All Stat\"}"
                    }`,
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
        analysis = completion.choices?.[0]?.message?.content ?? ''
        console.log('OpenAI analysis:', analysis)
        const analysisJson = JSON.parse(analysis)
        // Update gearData with the analysis
        try {
            const updatedGear = await prisma.gearItem.update({
                where: { id: gearData.id },
                data: {
                    name: analysisJson.name ?? gearData.name, // fallback to existing name if not provided
                    type: analysisJson.type ?? gearData.type, // fallback to existing type if not provided
                    rarity: analysisJson.rarity ?? 'Unknown', // fallback to 'Unknown' if not provided
                    tradeStatus: analysisJson.tradeStatus ?? 'untradeable', // fallback to 'untradeable' if not provided
                    starForce: analysisJson.starForce ?? 0, // fallback to 0 if not provided
                    attackPowerIncrease: analysisJson.attackPowerIncrease ?? 0, // fallback to 0 if not provided
                    combatPowerIncrease: analysisJson.combatPowerIncrease ?? 0, // fallback to 0 if not provided
                    requiredLevel: analysisJson.requiredLevel ?? 0, // fallback to 0 if not provided

                    totalStr: analysisJson.totalStr ?? 0,
                    baseStr: analysisJson.baseStr ?? 0,
                    flameStr: analysisJson.flameStr ?? 0,
                    starStr: analysisJson.starStr ?? 0,

                    totalDex: analysisJson.totalDex ?? 0,
                    baseDex: analysisJson.baseDex ?? 0,
                    flameDex: analysisJson.flameDex ?? 0,
                    starDex: analysisJson.starDex ?? 0,

                    totalInt: analysisJson.totalInt ?? 0,
                    baseInt: analysisJson.baseInt ?? 0,
                    flameInt: analysisJson.flameInt ?? 0,
                    starInt: analysisJson.starInt ?? 0,

                    totalLuk: analysisJson.totalLuk ?? 0,
                    baseLuk: analysisJson.baseLuk ?? 0,
                    flameLuk: analysisJson.flameLuk ?? 0,
                    starLuk: analysisJson.starLuk ?? 0,

                    totalAllStat: analysisJson.totalAllStat ?? 0,
                    baseAllStat: analysisJson.baseAllStat ?? 0,
                    flameAllStat: analysisJson.flameAllStat ?? 0,
                    potential: analysisJson.potential
                        ? JSON.stringify(analysisJson.potential)
                        : undefined,
                },
            })
            console.log('Gear data updated successfully', updatedGear)
        } catch (error) {
            console.error('Error updating gear data:', error)
        }
    }

    return (
        <div>
            <h1>
                {character} gear #{gear}
            </h1>
            <Image
                src={gearData.url ?? '/placeholder.png'}
                alt={gearData.name}
                width={200}
                height={200}
            />
            <p>
                <strong>OpenAI analysis:</strong> {analysis}
            </p>
            <Link href={`/${character}`}>
                <Button className='cursor-pointer'> View Character </Button>
            </Link>
            <Link href={`/${character}/editgear/${gearData.id}`}>
                <Button className='cursor-pointer'> Edit Gear </Button>
            </Link>
        </div>
    )
}
