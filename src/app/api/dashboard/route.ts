import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
	/* 1️⃣  Clerk session */
	const { userId } = await auth()
	if (!userId) {
		return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })
	}

	/* 2️⃣  Internal user */
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: { id: true, email: true },
	})
	if (!internalUser) {
		return NextResponse.json({ error: 'NO_INTERNAL_USER' }, { status: 403 })
	}

	/* 3️⃣  Characters */
	const characters = await prisma.character.findMany({
		where: { userId: internalUser.id },
		orderBy: { combatPower: 'desc' },
	})

	return NextResponse.json({ internalUser, characters })
}
