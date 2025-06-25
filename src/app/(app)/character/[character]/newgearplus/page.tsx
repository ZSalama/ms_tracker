import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { MultiUploader } from './components'
import { checkRole } from '@/utils/roles'
import { redirect } from 'next/navigation'
import IsOwner from '@/utils/isOwner'

export default async function page({
	params,
}: {
	params: Promise<{ character: string }>
}) {
	const { character } = await params
	if ((await IsOwner(character)) === false) {
		redirect(`/character/${character}`)
	}

	const isAdmin = (await checkRole('admin')) || (await checkRole('user'))

	return (
		<div className='max-w-4xl mx-auto px-4 py-8 space-y-10 grid md:grid-cols-2'>
			<div className='text-center'>
				<h1 className='text-4xl  mb-4 text-center'> Add gear</h1>
				<h2 className='text-2xl font-bold mb-4'>AI Gear Recognition</h2>
				<p className='mb-4'>
					This will allow you to upload an image of your gear, which will be
					processed to extract gear information. Change the UI size to 100% in
					the MapleStory settings, and take a screenshot of your gear window.
				</p>

				{isAdmin ? (
					<MultiUploader character={character} />
				) : (
					<p>
						currently disabled for guests. purchase a subsciption or contact me
						at undermouseweb@gmail.com for more info
					</p>
				)}
			</div>
			<div className='flex flex-col items-center px-12 '>
				<h2 className='text-2xl font-bold mb-4'>Manually Add Gear</h2>
				<Link href={`/character/${character}/newgear`}>
					<Button className='cursor-pointer'>Add gear</Button>
				</Link>
			</div>
		</div>
	)
}
