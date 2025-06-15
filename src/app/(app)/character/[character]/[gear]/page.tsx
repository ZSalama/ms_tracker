import { getQueryClient } from '@/lib/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'
import { getGears } from '../actions'
import { ImageOfGear, ViewGearContainer } from './components'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
	character: string
	gear: string
}

export default async function viewgear({ params }: { params: Promise<Props> }) {
	const props = await params

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery({
		queryKey: ['gears', props.character],
		queryFn: () => getGears(props.character),
	})

	return (
		<div className='container mx-auto px-4 py-8 space-y-10'>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<div className='grid lg:grid-cols-2 mx-auto justify-center items-center gap-10'>
					<div>
						<Link href={`/character/${props.character}`}>
							<Button className='cursor-pointer  mx-auto flex my-4'>
								Back to Character
							</Button>
						</Link>
						<ImageOfGear characterName={props.character} gearId={props.gear} />
					</div>

					<ViewGearContainer
						characterName={props.character}
						gearId={props.gear}
					/>
				</div>
			</HydrationBoundary>
		</div>
	)
}
