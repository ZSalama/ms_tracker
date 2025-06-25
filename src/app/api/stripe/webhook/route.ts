import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma' // remove if not needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// ⬇️  Stripe sends many events; we only care about sub life-cycle
const RELEVANT_EVENTS = new Set([
	'customer.subscription.created',
	'customer.subscription.updated',
	'customer.subscription.deleted',
])

export async function POST(req: NextRequest) {
	const sig = req.headers.get('stripe-signature') ?? ''
	const body = await req.text()
	const client = await clerkClient()

	/** 1️⃣  Verify signature */
	let event: Stripe.Event
	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!
		)
	} catch (err) {
		console.error('❌ Bad Stripe signature', err)
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
	}
	NextResponse.json({ received: true }, { status: 200 }) // Early response to avoid timeout

	/** 2️⃣  Ignore events we don’t care about */
	if (!RELEVANT_EVENTS.has(event.type)) {
		return NextResponse.json({ received: true })
	}

	/** 3️⃣  Determine the target role */
	const subscription = event.data.object as Stripe.Subscription

	/** Stripe “active” states you want to treat as paid */
	const ACTIVE_STATES: Stripe.Subscription.Status[] = [
		'active',
		'trialing',
		'past_due',
	]

	const targetRole: 'user' | 'guest' = ACTIVE_STATES.includes(
		subscription.status
	)
		? 'user'
		: 'guest'

	/** 4️⃣  Find our local user via the Stripe customer ID we stored earlier */
	const customerId = subscription.customer as string
	const userRow = await prisma.user.findUnique({
		where: { stripeId: customerId },
		select: { id: true, clerkId: true },
	})

	if (!userRow) {
		console.warn(`Stripe customer ${customerId} not found in Prisma`)
		return NextResponse.json({ received: true })
	}

	/** 5️⃣  Check current metadata so we never clobber an ‘admin’ */
	const existingClerkUser = await client.users.getUser(userRow.clerkId)
	const currentRole = existingClerkUser.publicMetadata.role as
		| 'admin'
		| 'user'
		| 'guest'
		| undefined
	if (currentRole === 'admin' || currentRole === targetRole) {
		// Nothing to do
		return NextResponse.json({ received: true })
	}

	/** 6️⃣  Update Clerk (and optionally Prisma) in parallel */
	const clerkPromise = client.users.updateUserMetadata(userRow.clerkId, {
		publicMetadata: { role: targetRole },
	})

	await Promise.allSettled([clerkPromise])

	console.log(
		`🔄 Role for user ${userRow.id}: ${
			currentRole ?? 'undefined'
		} → ${targetRole}`
	)
	return NextResponse.json({ received: true })
}

/** 7️⃣  Tell Next.js we need the raw body for signature verification */
export const config = {
	runtime: 'edge', // or 'nodejs' if you depend on Node APIs
	api: { bodyParser: false },
}
