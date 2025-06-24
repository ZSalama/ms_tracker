import Link from 'next/link'
import { Button } from '@/components/ui/button'
import EditGearFormWrapper from './EditGearFormWrapper'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { getGears } from '../../actions'

type props = { character: string; gear: string }

export default async function page({ params }: { params: Promise<props> }) {
	const props = await params

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery({
		queryKey: ['gears', props.character],
		queryFn: () => getGears(props.character),
	})

	return (
		<div className='container mx-auto px-4 py-8 space-y-10'>
			<div className='flex justify-center flex-col mx-auto max-w-xl'>
				<Link href={`/character/${props.character}`}>
					<Button className='cursor-pointer  flex my-4'>
						Back to Character
					</Button>
				</Link>
				{/* <EditGearFormClient
					characterName={props.character}
					gearId={props.gear}
				/> */}

				<HydrationBoundary state={dehydrate(queryClient)}>
					<EditGearFormWrapper
						characterName={props.character}
						gearId={props.gear}
					/>
				</HydrationBoundary>
			</div>
		</div>
	)
}
