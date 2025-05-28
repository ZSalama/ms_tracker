'use server'

import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function deleteGearAction(gearId: number, characterName: string) {
    const { userId: clerkId } = await auth()
    if (!clerkId) throw new Error('Unauthenticated')

    // verify gear exists
    const gear = await prisma.gearItem.findUnique({
        where: { id: gearId },
        include: { character: { select: { userId: true } } },
    })
    if (!gear) throw new Error('Gear not found')

    // verify character ownership
    const character = await prisma.character.findFirst({
        where: { name: characterName },
        select: { id: true, name: true, userId: true, user: true },
    })
    if (!character) throw new Error('Character not found')

    // verify logged-in user owns the character
    if (character.user.clerkId !== clerkId) throw new Error('Not authorized')

    // Perform delete
    await prisma.gearItem.delete({ where: { id: gearId } })

    console.log(`Gear item with ID ${gearId} deleted successfully.`)

    // Redirect back to character page
    redirect(`/${characterName}`)
}
