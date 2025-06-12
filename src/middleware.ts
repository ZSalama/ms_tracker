import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
	const { userId, redirectToSignIn } = await auth()
	const { pathname } = req.nextUrl

	if (!userId && isProtectedRoute(req)) {
		return redirectToSignIn()
	}
	// 2) Character routes: only protect if there's an extra segment
	if (pathname.startsWith('/character/')) {
		// split into ['character', '<name>', ...rest]
		const segments = pathname.split('/').filter(Boolean)
		const isDeepCharacterRoute = segments.length > 2

		if (isDeepCharacterRoute && !userId) {
			return redirectToSignIn()
		}
	}
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
