import Header from '@/components/header/Header'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
	return (
		<div className='h-dvh'>
			<Header className='absolute bg-muted ' />
			<section className='h-dvh flex items-center justify-center px-6'>
				<div className='text-center max-w-xl space-y-6 z-10 bg-primary p-10 '>
					<h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-foreground'>
						Level-Up Your MapleStory Progress
					</h1>

					<p className='text-lg sm:text-xl text-primary-foreground'>
						Track gear, view stats, and plan your next upgrade across all of
						your characters.
					</p>
					<div className='flex flex-col md:flex-row gap-3 justify-center'>
						<SignUpButton>
							<Button className='cursor-pointer border-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary'>
								Sign Up
							</Button>
						</SignUpButton>
						<SignedIn>
							<Link href='/dashboard'>
								<Button className='cursor-pointer border-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary'>
									Dashboard
								</Button>
							</Link>
						</SignedIn>
						<SignedOut>
							<SignInButton>
								<Button className='cursor-pointer border-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary'>
									Sign In
								</Button>
							</SignInButton>
						</SignedOut>
					</div>
				</div>
				<div className='absolute top-0 left-0 w-full h-dvh z-0'>
					<Image
						src='/hero.png'
						alt='hero background'
						fill
						className='object-cover opacity-50'
						priority={true}
					/>
				</div>
			</section>
		</div>
	)
}
