import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@clerk/nextjs/server' // or your preferred auth
import { prisma } from '@/lib/prisma'

export async function POST() {
	const { userId } = await auth() // grab signed-in user
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
	const internalUser = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: { id: true, email: true, stripeId: true },
	})
	if (!internalUser) {
		return NextResponse.json(
			{ error: 'No internal user found' },
			{ status: 404 }
		)
	}
	try {
		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			customer_email: internalUser.email, // pass email if you have it
			payment_method_types: ['card'],
			// customer: internalUser.stripeId!, // use the Stripe customer ID
			line_items: [
				{
					price: process.env.STRIPE_PRICE_ID!,
					quantity: 1,
				},
			],
			success_url: `${process.env.DOMAIN}/dashboard/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.DOMAIN}/dashboard/subscribe/cancel`,
			// optional: reference your app user for analytics
			client_reference_id: userId,
			metadata: { userId },
		})

		return NextResponse.json({ url: session.url })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Stripe error' }, { status: 500 })
	}
}
