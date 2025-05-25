import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Uploader from './uploader'

export default async function page({
    params,
}: {
    params: Promise<{ character: string }>
}) {
    const { character } = await params
    return (
        <>
            <Link href={`/${character}/newgear`}>
                <Button className='cursor-pointer'>
                    Manually add your gear
                </Button>
            </Link>
            <div>upload image and get gear data</div>
            <Uploader character={character} />
        </>
    )
}
