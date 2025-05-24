import React from 'react'

export default function EditGearForm({
    character,
    characterId,
    gearId,
}: {
    character: string
    characterId: number
    gearId: number
}) {
    return (
        <div>
            {character} {characterId} {gearId}
        </div>
    )
}
