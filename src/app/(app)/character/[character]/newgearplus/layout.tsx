import { ourFileRouter } from '@/app/api/uploadthing/core'
import { CharacterGearProvider } from '@/context/CharacterGearContext'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'

export default function layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<CharacterGearProvider>
			<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
			{children}
		</CharacterGearProvider>
	)
}
