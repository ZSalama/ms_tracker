import NewGearForm from './NewGearForm'
import { prisma } from '@/lib/prisma'

export default async function NewGear({
    params,
}: {
    params: Promise<{ character: string }>
}) {
    const { character } = await params
    const characterId = await prisma.character.findFirst({
        where: { name: character },
        select: { id: true },
    })
    if (!characterId) {
        return <div>Character not found</div>
    }

    return (
        <div className='flex justify-center'>
            <NewGearForm character={character} characterId={characterId.id} />
        </div>
    )
}
