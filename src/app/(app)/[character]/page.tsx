import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

//should check if user is logged in

export default async function page({
    params,
}: {
    params: Promise<{ character: string }>
}) {
    const { character } = await params

    // call prisma for character data
    const characterData = await prisma.character.findFirst({
        where: { name: character },
        select: {
            id: true,
            name: true,
            level: true,
            class: true,
            combatPower: true,
            gears: true,
        },
    })

    if (!characterData) {
        return <div>Character not found</div>
    }
    return (
        <>
            <div>
                <Suspense fallback={<Loading />}>
                    <DisplayCharacterData characterProp={characterData} />
                    <Link href={`/${character}/newgear`}>New Gear</Link>
                </Suspense>
            </div>
            <div>
                {characterData.gears.map((gear) => (
                    <div key={gear.id}>
                        <h1>{gear.name}</h1>
                        <p>Level: {gear.type}</p>
                        <p>Class: {gear.starForce}</p>
                        <p>Combat Power: {gear.combatPowerIncrease}</p>
                        <Link href={`/${character}/editgear/${gear.id}`}>
                            Edit Gear
                        </Link>
                    </div>
                ))}
            </div>
        </>
    )
}

function Loading() {
    return <div> loading </div>
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
        <div>
            <h1>{characterProp.name}</h1>
            <p>Level: {characterProp.level}</p>
            <p>Class: {characterProp.class}</p>
            <p>Combat Power: {characterProp.combatPower}</p>
        </div>
    )
}
