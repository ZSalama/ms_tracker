import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'

export default async function Header({ className }: { className: string }) {
	return (
		<header
			className={`flex justify-end items-center p-4 gap-4 h-16 z-10 w-full ${className}`}
		>
			<Link href='/learn'>
				<Button className='cursor-pointer'>Learn</Button>
			</Link>
			<Link href='/dashboard'>
				<Button className='cursor-pointer'>Dashboard</Button>
			</Link>
			<SignedIn>
				<SignOutButton>
					<Button className='cursor-pointer'>Logout</Button>
				</SignOutButton>
			</SignedIn>
			<SignedOut>
				<Link href='/dashboard/login'>
					<Button className='cursor-pointer'>Login</Button>
				</Link>
			</SignedOut>
		</header>
	)
}
