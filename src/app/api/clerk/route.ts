import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const payload = await req.text()
    console.log(payload)

    const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
    let evt: WebhookEvent

    try {
        evt = svix.verify(
            payload,
            Object.fromEntries(req.headers) // Svix wants a plain object
        ) as WebhookEvent
    } catch {
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        )
    }

    if (evt.type === 'user.created') {
        const u = evt.data

        // Clerk always gives at least one verified email
        const primaryEmail = u.email_addresses?.[0]?.email_address ?? ''

        try {
            await prisma.user.create({
                data: {
                    clerkId: u.id,
                    email: primaryEmail,
                    name: u.first_name,
                },
            })
        } catch (e) {
            console.error('Prisma create failed:', e)
            return NextResponse.json({ error: 'DB error' }, { status: 500 })
        }
    }

    // 4️⃣ Ack promptly – Clerk retries on non-2xx
    return NextResponse.json({ received: true }, { status: 200 })
}
