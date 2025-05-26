import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/header/Header'
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <Header />
            {children}
            <Analytics />
        </ClerkProvider>
    )
}
