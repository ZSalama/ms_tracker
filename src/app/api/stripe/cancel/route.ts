import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server' // or your own auth util

export async function POST(req: Request) {
	// 1. Require authentication
	const { userId } = await auth()
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	// 2. Parse payload
	const { subscriptionId }: { subscriptionId?: string } = await req.json()
	if (!subscriptionId) {
		return NextResponse.json(
			{ error: 'Missing subscriptionId' },
			{ status: 400 }
		)
	}

	// 3. Optionally verify that this sub belongs to the signed-in user
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: { stripeId: true },
	})
	if (!internalUser?.stripeId) {
		return NextResponse.json(
			{ error: 'No Stripe customer on file' },
			{ status: 404 }
		)
	}

	try {
		// 4. Tell Stripe to cancel at period end (set to false for immediate cancel)
		const cancelled = await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: true,
		})

		// 5. Mirror the new status in your own DB if you track it
		await prisma.user.updateMany({
			where: { stripeSubscriptionId: subscriptionId },
			data: { subscription: 'canceled' }, // usually “active” until period end, then “canceled”
		})

		return NextResponse.json({ status: cancelled.status }, { status: 200 })
	} catch (err) {
		console.error('[stripe.cancel]', err)
		return NextResponse.json({ error: 'Stripe error' }, { status: 500 })
	}
}
