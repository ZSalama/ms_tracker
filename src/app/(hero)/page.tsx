import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from '@clerk/nextjs'

export default function Hero() {
    return (
        <section className='h-dvh flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-6'>
            <div className='text-center max-w-xl space-y-6'>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white'>
                    Level-Up Your MapleStory Progress
                </h1>

                <p className='text-lg sm:text-xl text-white/80'>
                    Track gear, view stats, and plan your next upgrade—all in
                    one place.
                </p>
                <SignedOut>
                    <div className='flex justify-center gap-4'>
                        <SignInButton mode='modal'>
                            <button className='inline-block rounded-lg bg-white/90 px-6 py-3 font-semibold text-indigo-700 shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:bg-white'>
                                Sign In
                            </button>
                        </SignInButton>

                        <SignUpButton mode='modal'>
                            <button className='inline-block rounded-lg bg-white/90 px-6 py-3 font-semibold text-indigo-700 shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:bg-white'>
                                Sign Up
                            </button>
                        </SignUpButton>
                    </div>
                </SignedOut>
            </div>
        </section>
    )
}
