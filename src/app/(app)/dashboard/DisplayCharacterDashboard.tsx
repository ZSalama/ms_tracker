'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { getCharacters } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'

export default function DisplayCharacterDashboard() {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['characters'],
		queryFn: () => getCharacters(),
	})
	const { sessionClaims } = useAuth()
	if (isLoading) {
		return <p>Loading...</p>
	}
	if (isError) {
		return <p>Error loading characters.</p>
	}
	return (
		<main className='mx-auto max-w-4xl px-6 py-12'>
			<div className='mb-8 flex flex-col gap-4 items-center justify-between'>
				<h1 className='text-xl md:text-3xl font-extrabold'>
					{data.internalUser.email}&apos;s Characters
				</h1>
				<div className='flex flex-row flex-wrap items-center gap-4'>
					<p>Account type: {sessionClaims?.metadata.role}</p>
					<Link href='/dashboard/new-character'>
						<Button className='cursor-pointer'>+ New Character</Button>
					</Link>
					<Link href='/dashboard/subscribe'>
						<Button className='cursor-pointer'>Subscribe</Button>
					</Link>
				</div>
			</div>
			{data.characters.length === 0 ? (
				<p className='text-gray-500'>
					You don’t have any characters yet. Click “New Character” to get
					started!
				</p>
			) : (
				<ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{data.characters.map((c) => (
						<li key={c.id}>
							<Link
								href={`/character/${c.name}`}
								className='block rounded-xl border border-gray-200 bg-white p-5 dark:text-gray-900 shadow-sm transition hover:shadow-md'
							>
								<h2 className='truncate text-lg font-semibold'>{c.name}</h2>
								<p className='text-sm '>
									{c.level} &middot; {c.class}
								</p>

								<div className='mt-3 space-y-1 text-sm text-gray-600'>
									<p>Combat Power: {c.combatPower.toLocaleString()}</p>
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
