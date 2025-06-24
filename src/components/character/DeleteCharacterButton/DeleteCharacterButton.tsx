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
import { useRouter } from 'next/navigation'

export function DeleteCharacterButton({
	characterName,
}: {
	characterName: string
}) {
	const router = useRouter()
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='cursor-pointer w-full' variant='destructive'>
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
						onClick={async () => {
							console.log(`Delete character: ${characterName}`)
							const res = await deleteCharacterAction(characterName)
							if (res.ok) {
								console.log(`Character ${characterName} deleted successfully.`)
								router.push('/dashboard')
							} else {
								console.error(`Failed to delete character ${characterName}.`)
							}
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
