import NewGearForm from './NewGearForm'

export default async function NewGear({
    params,
}: {
    params: Promise<{ character: string }>
}) {
    const { character } = await params

    return (
        <div className='flex justify-center'>
            <NewGearForm character={character} />
        </div>
    )
}
