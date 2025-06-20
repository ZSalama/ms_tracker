'use client'

import { redirect } from 'next/navigation'
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
import { Character } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { classStats, classNames } from '@/lib/types'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export default function EditCharacterForm({
	characterId,
	characterData,
}: {
	characterId: number
	characterData: Character
}) {
	const [isPending, startTransition] = useTransition()
	const queryClient = useQueryClient()
	const sortedClassNames = classNames.sort()

	console.log(classStats)

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
				queryClient.invalidateQueries({
					queryKey: ['characters'],
				})
				// redirect('/dashboard')
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
					name='class'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Class</FormLabel>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={isPending}
							>
								<FormControl>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Choose a class' />
									</SelectTrigger>
								</FormControl>
								<SelectContent className='w-full'>
									{sortedClassNames.map((cls) => (
										<SelectItem key={cls} value={cls}>
											{cls}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{(
					[
						{ name: 'combatPower', label: 'combat power', type: 'number' },
						{ name: 'level', label: 'level', type: 'number' },
						{ name: 'arcaneForce', label: 'arcane force', type: 'number' },
						{ name: 'sacredPower', label: 'sacred power', type: 'number' },
					] as {
						name: 'combatPower' | 'class' | 'level'
						label: string
						type: string
					}[]
				).map(({ name, label, type }) => (
					<FormField
						key={name}
						control={form.control}
						name={name}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{label}</FormLabel>
								<FormControl>
									<Input
										type={type}
										{...field}
										value={
											typeof field.value === 'object' && field.value !== null
												? ''
												: field.value ?? ''
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}

				<Button type='submit' disabled={isPending} className='cursor-pointer'>
					{isPending ? 'Saving…' : 'Update character'}
				</Button>
			</form>
		</Form>
	)
}
