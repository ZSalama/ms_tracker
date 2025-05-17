'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { characterSchema, CharacterSchema } from '@/lib/validators/character'
import { createCharacter } from './actions'
import { useTransition } from 'react'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function NewCharacterForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<CharacterSchema>({
        resolver: zodResolver(characterSchema),
        defaultValues: {
            name: '',
            level: 1,
            class: 'beginner',
            combatPower: 0,
            arcaneForce: 0,
            sacredPower: 0,
        },
    })

    async function onSubmit(values: CharacterSchema) {
        startTransition(async () => {
            const fd = new FormData()
            Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)))
            const result = await createCharacter(fd)

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
                window.location.href = '/dashboard'
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Mercedes' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/** repeat the same pattern for the numeric fields **/}
                {(
                    [
                        'level',
                        'combatPower',
                        'arcaneForce',
                        'sacredPower',
                    ] as const
                ).map((fieldName) => (
                    <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='capitalize'>
                                    {fieldName}
                                </FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                <FormField
                    control={form.control}
                    name='class'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class</FormLabel>
                            <FormControl>
                                <Input placeholder='Beginner' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' disabled={isPending} className='w-full'>
                    {isPending ? 'Saving…' : 'Add character'}
                </Button>
            </form>
        </Form>
    )
}
