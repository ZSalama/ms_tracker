import React from 'react'
import Link from 'next/link'

export default function Header() {
    return (
        <header className='flex justify-end items-center p-4 gap-4 h-16'>
            dis be da header yah
            <Link
                href='/dashboard'
                className='inline-block rounded-lg bg-white/90 px-6 py-3 font-semibold text-indigo-700 shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:bg-white'
            >
                dashboard
            </Link>
        </header>
    )
}
