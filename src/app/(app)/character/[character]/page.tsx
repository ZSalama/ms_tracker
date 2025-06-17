import { getQueryClient } from '@/lib/get-query-client'
import { getGears } from './actions'
import DisplayGearData from './DisplayGearData'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function Page({
	params,
}: {
	params: Promise<{ character: string }>
}) {
	const { character } = await params

	const queryClient = getQueryClient()

	void queryClient.prefetchQuery({
		queryKey: ['gears', character],
		queryFn: () => getGears(character),
	})

	return (
		<div className='container mx-auto px-4 py-8 space-y-10'>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<DisplayGearData characterName={character} />
			</HydrationBoundary>
		</div>
	)
}
