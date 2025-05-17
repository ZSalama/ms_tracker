import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'

export default function Header() {
    return (
        <header className='flex justify-end items-center p-4 gap-4 h-16'>
            dis be da header yah
        </header>
    )
}
