'use client'

import { Button } from '@/components/ui/button'
// import { Button } from '@/components/ui/button'
import { deleteGearAction } from './actions'
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
import { GearItem } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function DeleteGearButton({
	gearItem,
	characterName,
}: {
	gearItem: GearItem
	characterName: string
}) {
	const queryClient = useQueryClient()
	const { mutate, isPending } = useMutation({
		mutationFn: (payload: GearItem) => deleteGearAction(payload, characterName),
		onSuccess: () => {
			// instantly mark the query stale in the browser
			queryClient.invalidateQueries({ queryKey: ['gears', characterName] }) // :contentReference[oaicite:1]{index=1}
		},
	})
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive' className='cursor-pointer w-full'>
					Delete Gear
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your{' '}
						{gearItem.name} and remove the data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='cursor-pointer'>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className='cursor-pointer'
						onClick={() => {
							console.log(`Delete gear: ${gearItem.name}`)
							mutate(gearItem)
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
