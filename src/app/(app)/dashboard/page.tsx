import { auth } from '@clerk/nextjs/server' // Clerk helper (server-side)
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma' // your Prisma singleton
import type { Character } from '@prisma/client'

export default async function DashboardPage() {
    /* 1️⃣  Get the logged-in Clerk user */
    const { userId } = await auth()
    if (!userId) redirect('/sign-in') // not signed in ⇒ bounce

    /* 2️⃣  Look up the *internal* User row tied to that Clerk user.  
         ▸ Adjust where() if you store the Clerk ID differently. */
    const internalUser = await prisma.user.findUnique({
        where: { clerkId: userId }, // e.g. “clerkId” is a string column
        select: { id: true },
    })
    if (!internalUser) redirect('/') // first-time users

    /* 3️⃣  Fetch all their characters */
    const characters: Character[] = await prisma.character.findMany({
        where: { userId: internalUser.id },
        orderBy: { updatedAt: 'desc' },
    })

    /* 4️⃣  Render */
    return (
        <main className='mx-auto max-w-4xl px-6 py-12'>
            <header className='mb-8 flex items-center justify-between'>
                <h1 className='text-3xl font-extrabold'>Your Characters</h1>

                {/* -- optional “New” button -- */}
                <Link
                    href='/dashboard/new-character'
                    className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700'
                >
                    + New Character
                </Link>
            </header>

            {characters.length === 0 ? (
                <p className='text-gray-500'>
                    You don’t have any characters yet. Click “New Character” to
                    get started!
                </p>
            ) : (
                <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {characters.map((c) => (
                        <li key={c.id}>
                            <Link
                                href={`/${c.id}`}
                                className='block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md'
                            >
                                <h2 className='truncate text-lg font-semibold'>
                                    {c.name}
                                </h2>
                                <p className='text-sm text-gray-500'>
                                    Lv. {c.level} &middot; {c.class}
                                </p>

                                <div className='mt-3 space-y-1 text-sm text-gray-600'>
                                    <p>
                                        Combat Power:{' '}
                                        {c.combatPower.toLocaleString()}
                                    </p>
                                    <p>Arcane Force: {c.arcaneForce}</p>
                                    <p>Sacred Power: {c.sacredPower}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}
