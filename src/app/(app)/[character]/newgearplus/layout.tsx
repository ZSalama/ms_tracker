import { CharacterGearProvider } from '@/context/CharacterGearContext'

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <CharacterGearProvider>{children}</CharacterGearProvider>
}
