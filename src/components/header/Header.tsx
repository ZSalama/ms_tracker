import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function Header() {
    return (
        <header className='flex justify-end items-center p-4 gap-4 h-16'>
            <Link href='/learn'>
                <Button className='cursor-pointer'>Learn</Button>
            </Link>
            <Link href='/dashboard'>
                <Button className='cursor-pointer'>Dashboard</Button>
            </Link>
        </header>
    )
}
