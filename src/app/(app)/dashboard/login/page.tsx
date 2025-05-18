import { SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import React from 'react'

export default function Login() {
    return (
        <SignedOut>
            <div className='flex justify-center gap-4'>
                <SignInButton mode='modal'></SignInButton>

                <SignUpButton mode='modal'>
                    <button className='inline-block rounded-lg bg-white/90 px-6 py-3 font-semibold text-indigo-700 shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:bg-white'>
                        Sign Up
                    </button>
                </SignUpButton>
            </div>
        </SignedOut>
    )
}
