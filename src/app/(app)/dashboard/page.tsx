import { auth } from '@clerk/nextjs/server' // Clerk helper (server-side)
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma' // your Prisma singleton
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import DisplayCharacterDashboard from './DisplayCharacterDashboard'
import { getCharacters } from './actions'
import { getQueryClient } from '@/lib/get-query-client'
// import type { Character } from '@prisma/client'

export default async function DashboardPage() {
	/* Prefetch on the server so the first paint has data */
	const queryClient = getQueryClient()

	void queryClient.prefetchQuery({
		queryKey: ['characters'],
		queryFn: () => getCharacters(),
	})

	return (
		// Neat! Serialization is now as easy as passing props.
		// HydrationBoundary is a Client Component, so hydration will happen there.
		<HydrationBoundary state={dehydrate(queryClient)}>
			<DisplayCharacterDashboard />
		</HydrationBoundary>
	)
}
