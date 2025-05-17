import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'

export default async function page({
    params,
}: {
    params: Promise<{ character: string }>
}) {
    const { character } = await params

    // call prisma for character data

    const characterData = await prisma.character.findUnique({
        where: { id: character },
        select: {
            id: true,
            name: true,
            level: true,
            class: true,
            combatPower: true,
        },
    })

    if (!characterData) {
        return <div>Character not found</div>
    }
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <DisplayCharacterData characterProp={characterData} />
            </Suspense>
        </div>
    )
}

function Loading() {
    return <div> loading </div>
}

type CharacterInfo = {
    id: string
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
