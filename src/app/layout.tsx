import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers, ThemeProvider } from './providers'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'MapleStory Tracker',
	description: 'Created by UnderMouse',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<ClerkProvider>
						<ThemeProvider
							attribute='class'
							defaultTheme='light'
							enableSystem
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
					</ClerkProvider>
					{process.env.NODE_ENV !== 'production' ? (
						<ReactQueryDevtools />
					) : null}
				</Providers>
			</body>
		</html>
	)
}
