import React, { Suspense } from 'react'
import { ImageOfGear, ViewGearContainer } from './components'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
	character: string
	gear: string
}

export default async function viewgear({ params }: { params: Promise<Props> }) {
	const props = await params

	return (
		<Suspense fallback={<div className='text-center'>Loading gear...</div>}>
			<div className='container mx-auto px-4 py-8 space-y-10'>
				<div className='grid lg:grid-cols-2 mx-auto justify-center gap-10'>
					<div>
						<Link href={`/character/${props.character}`}>
							<Button className='cursor-pointer  mx-auto flex my-4'>
								Back to Character
							</Button>
						</Link>
						<ImageOfGear characterName={props.character} gearId={props.gear} />
					</div>
					<div>
						<Link href={`/character/${props.character}/editgear/${props.gear}`}>
							<Button className='cursor-pointer mx-auto flex my-4 w-fit'>
								Edit Gear
							</Button>
						</Link>
						<ViewGearContainer
							characterName={props.character}
							gearId={props.gear}
						/>
					</div>
				</div>
			</div>
		</Suspense>
	)
}
