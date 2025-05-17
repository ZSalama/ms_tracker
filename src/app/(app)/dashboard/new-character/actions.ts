'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { characterSchema } from '@/lib/validators/character'
import { redirect } from 'next/navigation'

export async function createCharacter(formData: FormData) {
    const parsed = characterSchema.safeParse(
        Object.fromEntries(formData.entries())
    )
    if (!parsed.success) {
        // Bubble the zod errors back to the form
        return { error: parsed.error.flatten().fieldErrors }
    }
    const { userId } = await auth()
    if (!userId) redirect('/sign-in') // not signed in ⇒ bounce

    /* 2️⃣  Look up the *internal* User row tied to that Clerk user.  
         ▸ Adjust where() if you store the Clerk ID differently. */
    const internalUser = await prisma.user.findUnique({
        where: { clerkId: userId }, // e.g. “clerkId” is a string column
        select: { id: true },
    })
    if (!internalUser) redirect('/')

    await prisma.character.create({
        data: {
            ...parsed.data,
            userId: internalUser.id,
        },
    })

    // Refresh any page that reads the character list
    revalidatePath('/dashboard/characters')
    return { success: true }
}
