'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { characterSchema, CharacterSchema } from '@/lib/validators/character'
import { editCharacterItem } from './actions'

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import Link from 'next/link'
import { Character } from '@prisma/client'

export default function EditCharacterForm({
	character,
	characterId,
	characterData,
}: {
	character: string
	characterId: number
	characterData: Character
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	/* ---------------- RHF setup ---------------- */
	const form = useForm<CharacterSchema>({
		resolver: zodResolver(characterSchema),
		defaultValues: {
			name: characterData.name,
			level: characterData.level,
			class: characterData.class,
			combatPower: characterData.combatPower,
			arcaneForce: characterData.arcaneForce,
			sacredPower: characterData.sacredPower,
		},
	})

	async function onSubmit(values: CharacterSchema) {
		// console.log('onSubmit', values)
		startTransition(async () => {
			const fd = new FormData()
			Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)))
			const result = await editCharacterItem(fd, characterId)

			if (result?.error) {
				// Push Zod errors back into react-hook-form
				Object.entries(result.error).forEach(([field, messages]) =>
					form.setError(field as keyof CharacterSchema, {
						message: (messages as string[])[0],
					})
				)
			} else if (result?.success) {
				form.reset() // clear the form
				// redirect to dasbhoard
				router.push('/dashboard')
			}
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, (errors) =>
					console.log('validation errors', errors)
				)}
				className='space-y-6 max-w-xl'
			>
				{/* <input type='hidden' {...form.register('characterId')} /> */}

				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									disabled
									placeholder={`${characterData.name}`}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='level'
					render={({ field }) => (
						<FormItem>
							<FormLabel>level</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder={`${characterData.level}`}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='class'
					render={({ field }) => (
						<FormItem>
							<FormLabel>class</FormLabel>
							<FormControl>
								<Input
									type='text'
									disabled
									placeholder={`${characterData.class}`}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='combatPower'
					render={({ field }) => (
						<FormItem>
							<FormLabel>combat power</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder={`${characterData.combatPower}`}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='arcaneForce'
					render={({ field }) => (
						<FormItem>
							<FormLabel>arcane force</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder={`${characterData.arcaneForce}`}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='sacredPower'
					render={({ field }) => (
						<FormItem>
							<FormLabel>sacred power</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder={`${characterData.sacredPower}`}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' disabled={isPending} className='cursor-pointer'>
					{isPending ? 'Saving…' : 'Update character'}
				</Button>
			</form>
		</Form>
	)
}
