'use client'

import { Button } from '@/components/ui/button'
// import { Button } from '@/components/ui/button'
import { deleteCharacterAction } from './actions'
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

export function DeleteCharacterButton({
	characterName,
}: {
	characterName: string
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='cursor-pointer' variant='destructive'>
					Delete Character
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						character and remove your data from our servers.
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
