'use client'

import { Button } from '@/components/ui/button'
import { deleteGearAction } from './actions'

export function DeleteGearButton({
    gearId,
    characterName,
}: {
    gearId: number
    characterName: string
}) {
    return (
        <Button
            type='submit'
            className='mt-4 ml-4 rounded-md border border-red-600 px-3 py-1 text-sm font-medium bg-gray-200 text-red-600 hover:bg-red-50 cursor-pointer'
            onClick={() => {
                deleteGearAction(gearId, characterName)
            }}
        >
            Delete Gear
        </Button>
    )
}
