import React from 'react'
import CancelSubscriptionButton from './CancelSubsciptionButton'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export default async function page() {
	const { userId } = await auth()

	// find internal user from Clerk userId
	if (!userId) {
		return <div>You must be logged in to cancel your subscription.</div>
	}
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: { stripeSubscriptionId: true },
	})
	if (!internalUser?.stripeSubscriptionId) {
		return <div>You do not have an active subscription to cancel.</div>
	}

	return (
		<CancelSubscriptionButton
			subscriptionId={internalUser.stripeSubscriptionId}
		/>
	)
}
