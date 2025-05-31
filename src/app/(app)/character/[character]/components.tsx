'use client'

import { Button } from '@/components/ui/button'
import { deleteGearAction, deleteCharacterAction } from './actions'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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

export function DeleteCharacterButton({
    characterName,
}: {
    characterName: string
}) {
    return (
        // <Button
        //     type='submit'
        //     className='mt-4 ml-4 rounded-md border border-red-600 px-3 py-1 text-sm font-medium bg-gray-200 text-red-600 hover:bg-red-50 cursor-pointer'
        //     onClick={() => {
        //         // Implement delete character action here
        //         console.log(`Delete character: ${characterName}`)
        //         deleteCharacterAction(characterName)
        //     }}
        // >
        //     Delete Character
        // </Button>
        <AlertDialog>
            <AlertDialogTrigger className='mt-4 ml-4 rounded-md border border-red-600 px-3 py-1 text-sm font-medium bg-gray-200 text-red-600 hover:bg-red-50 cursor-pointer'>
                Delete Character
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your character and remove your data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className='cursor-pointer'>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='cursor-pointer'
                        onClick={() => {
                            console.log(`Delete character: ${characterName}`)
                            deleteCharacterAction(characterName)
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
