import { SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Login() {
    // check to see if the user loged in
    const { userId } = await auth()
    // if logged in, redirect to dashboard
    if (userId) redirect('/dashboard')
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
