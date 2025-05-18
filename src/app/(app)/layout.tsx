import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/header/Header'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <Header />
            {children}
        </ClerkProvider>
    )
}
