import React from 'react'
import { auth } from '@clerk/nextjs/server'
import EditCharacterForm from './EditCharacterForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { getCharacters } from '@/app/(app)/dashboard/actions'

export default async function page({
	params,
}: {
	params: Promise<{ character: string }>
}) {
	const { character } = await params

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery({
		queryKey: ['characters'],
		queryFn: getCharacters,
	})
	//check to see if the user loged in
	const { userId } = await auth()
	if (!userId) {
		return <div>Not logged in</div>
	}

	return (
		<div className='flex justify-center flex-col mx-auto max-w-xl'>
			<div className='mb-4'>
				<Link href={`/character/${character}`}>
					<Button className='cursor-pointer'>back to character</Button>
				</Link>
			</div>

			<HydrationBoundary state={dehydrate(queryClient)}>
				<EditCharacterForm character={character} />
			</HydrationBoundary>
		</div>
	)
}
