import React from 'react'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import OpenAI from 'openai'

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
            model: 'gpt-4o-mini',
            // response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content:
                        'Please analyze the following image and describe what you see.',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Please transcribe & label this image.',
                        },
                        { type: 'image_url', image_url: { url: gearData.url } },
                    ],
                },
            ],
        })
        analysis = completion.choices?.[0]?.message?.content ?? ''
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
        </div>
    )
}
