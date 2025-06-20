import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { MultiUploader } from './components'

export default async function page({
	params,
}: {
	params: Promise<{ character: string }>
}) {
	const { character } = await params
	return (
		<div className='max-w-4xl mx-auto px-4 py-8 space-y-10 grid grid-cols-2'>
			<div className='text-center'>
				<h2 className='text-2xl font-bold mb-4'>AI Gear Recognition</h2>
				<p className='mb-4'>
					This will allow you to upload an image of your gear, which will be
					processed to extract gear information. Change the UI size to 100% in
					the MapleStory settings, and take a screenshot of your gear window.
				</p>
				<MultiUploader character={character} />
				{/* <Uploader character={character} /> */}
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
