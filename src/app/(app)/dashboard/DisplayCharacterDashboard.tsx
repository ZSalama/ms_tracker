'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { getCharacters } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export default function DisplayCharacterDashboard() {
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['characters'],
		queryFn: () => getCharacters(),
	})
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
				<Link href='/dashboard/new-character'>
					<Button className='cursor-pointer'>+ New Character</Button>
				</Link>
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
							<Link href={`/character/${c.name}`} className='block'>
								<Card>
									<CardHeader>
										<CardTitle>{c.name}</CardTitle>
										<CardDescription>
											{c.level.toString()} {c.class}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p>Combat Power: {c.combatPower.toLocaleString()}</p>
										<p>Arcane Force: {c.arcaneForce}</p>
										<p>Sacred Power: {c.sacredPower}</p>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}
				</ul>
			)}
		</main>
	)
}
