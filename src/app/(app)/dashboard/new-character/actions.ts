'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { characterSchema } from '@/lib/validators/character'
import { redirect } from 'next/navigation'
import { classStats } from '@/lib/types'
import { getQueryClient } from '@/lib/get-query-client'

export async function createCharacter(formData: FormData) {
	const queryClient = getQueryClient()
	const parsed = characterSchema.safeParse(
		Object.fromEntries(formData.entries())
	)
	if (!parsed.success) {
		// Bubble the zod errors back to the form
		return { error: parsed.error.flatten().fieldErrors }
	}
	const { userId } = await auth()
	if (!userId) redirect('/dashboard/sign-in') // not signed in ⇒ bounce

	/* 2️⃣  Look up the *internal* User row tied to that Clerk user.  
         ▸ Adjust where() if you store the Clerk ID differently. */
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId }, // e.g. “clerkId” is a string column
		select: { id: true },
	})
	if (!internalUser) redirect('/')

	const mainStat = classStats[parsed.data.class].main || 'int'
	const subStat = classStats[parsed.data.class].sub || 'luk'
	const attackType = classStats[parsed.data.class].attackType || 'Attack'

	await prisma.character.create({
		data: {
			...parsed.data,
			userId: internalUser.id,
			flameWeightAttackType: attackType,
			flameWeightMainType: mainStat,
			flameWeightSubType: subStat,
			// flameWeightAllStat: parsed.data.flameWeightAllStat || 1,
		},
	})

	// Refresh any page that reads the character list
	queryClient.invalidateQueries({ queryKey: ['characters'] })
	return { success: true }
}
