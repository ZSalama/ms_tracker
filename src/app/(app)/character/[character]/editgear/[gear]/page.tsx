import React from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import EditGearForm from './EditGearForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function page({
    params,
}: {
    params: Promise<{ character: string; gear: number }>
}) {
    const { character, gear } = await params

    //check to see if the user loged in
    const { userId } = await auth()
    if (!userId) {
        return <div>Not logged in</div>
    }

    //get the userId from the auth
    const internalUser = await prisma.user.findUnique({
        where: { clerkId: userId }, // e.g. “clerkId” is a string column
        select: { id: true, email: true },
    })
    if (!internalUser) redirect('/') // first-time users
    console.log('internalUser', internalUser)

    // check to see if the character exists
    const characterData = await prisma.character.findFirst({
        where: { name: character, userId: internalUser.id },
        select: {
            id: true,
        },
    })

    if (!characterData) {
        return <div>Character not found</div>
    }

    // check to see if the gear exists
    const gearData = await prisma.gearItem.findFirst({
        where: { id: Number(gear), characterId: characterData.id },
    })
    if (!gearData) {
        return <div>Gear not found</div>
    }

    // check to see if the gear belongs to the character
    if (gearData.characterId !== characterData.id) {
        return <div>Gear does not belong to character</div>
    }

    return (
        <div className='flex justify-center flex-col mx-auto max-w-xl'>
            <div className='mb-4'>
                <Link href={`/character/${character}`}>
                    <Button className='cursor-pointer'>
                        back to character
                    </Button>
                </Link>
            </div>

            <EditGearForm
                character={character}
                characterId={characterData.id}
                gearId={gear}
                gearData={gearData}
            />
        </div>
    )
}
