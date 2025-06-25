import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
	const payload = await req.text()
	const client = await clerkClient()

	const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
	let evt: WebhookEvent

	try {
		evt = svix.verify(
			payload,
			Object.fromEntries(req.headers) // Svix wants a plain object
		) as WebhookEvent
	} catch {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
	}
	NextResponse.json({ received: true }, { status: 200 }) // Early response to avoid timeout

	if (evt.type === 'user.created') {
		const u = evt.data
		const primaryEmail = u.email_addresses?.[0]?.email_address ?? ''

		try {
			const stripeCustomer = await stripe.customers.create({
				email: primaryEmail,
				name: [u.first_name, u.last_name].filter(Boolean).join(' '),
				metadata: {
					clerkId: u.id,
				},
			})
			const clerkPromise = client.users.updateUserMetadata(u.id, {
				publicMetadata: { role: 'guest' },
			})

			const dbPromise = prisma.user.create({
				data: {
					clerkId: u.id,
					email: primaryEmail,
					name: u.first_name,
					stripeId: stripeCustomer.id,
				},
			})

			await Promise.all([clerkPromise, dbPromise])
		} catch (e) {
			console.error('Prisma create failed:', e)
			return NextResponse.json({ error: 'Provisioning Error' }, { status: 500 })
		}
	}

	return NextResponse.json({ received: true }, { status: 200 })
}
