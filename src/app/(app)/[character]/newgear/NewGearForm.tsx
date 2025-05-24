'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { gearSchema, GearSchema } from '@/lib/validators/gear'
import { createGearItem } from './actions'

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'

export default function NewGearForm({
    character,
    characterId,
}: {
    character: string
    characterId: number
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    /* ---------------- RHF setup ---------------- */
    const form = useForm<GearSchema>({
        resolver: zodResolver(gearSchema),
        defaultValues: {
            name: '',
            starForce: 22,
            type: 'Ring',
            rarity: 'Common',
            attackPowerIncrease: 0,
            combatPowerIncrease: 0,
            requiredLevel: 0,
            potential: '',
            isEquipped: false,
            str: 0,
            flameStr: 0,
            starStr: 0,
            dex: 0,
            flameDex: 0,
            starDex: 0,
            int: 0,
            flameInt: 0,
            starInt: 0,
            luk: 0,
            flameLuk: 0,
            starLuk: 0,
            maxHP: 0,
            flameMaxHP: 0,
            starMaxHP: 0,
            maxMP: 0,
            flameMaxMP: 0,
            starMaxMP: 0,
            attackPower: 0,
            flameAttackPower: 0,
            starAttackPower: 0,
            magicAttackPower: 0,
            flameMagicAttackPower: 0,
            starMagicAttackPower: 0,
            allStat: '',
            flameAllStat: '',
            starAllStat: '',
            bossDamage: '',
            flameBossDamage: '',
            starBossDamage: '',
            ignoreEnemyDefense: '',
            flameIgnoreEnemyDefense: '',
        },
    })

    async function onSubmit(values: GearSchema) {
        // console.log('onSubmit', values)
        startTransition(async () => {
            const fd = new FormData()
            Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)))
            const result = await createGearItem(fd, characterId)

            if (result?.error) {
                // Push Zod errors back into react-hook-form
                Object.entries(result.error).forEach(([field, messages]) =>
                    form.setError(field as keyof GearSchema, {
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
                <div>{character}</div>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Twilight Mark' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='starForce'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>starForce</FormLabel>
                            <FormControl>
                                <Input placeholder='22' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ----- Type / Rarity row ----- */}
                <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            {field.value}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                'Ring',
                                                'Face Accessory',
                                                'Gloves',
                                                'Weapon',
                                                'Hat',
                                                'Cape',
                                                'Shoes',
                                                'Top',
                                                'Bottom',
                                                'Pendant',
                                            ].map((t) => (
                                                <SelectItem key={t} value={t}>
                                                    {t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='rarity'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rarity</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            {field.value}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                'Common',
                                                'Rare',
                                                'Epic',
                                                'Unique',
                                                'Legendary',
                                            ].map((r) => (
                                                <SelectItem key={r} value={r}>
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* ----- numeric trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        {
                            name: 'attackPowerIncrease',
                            label: 'attack Power Increase',
                        },
                        {
                            name: 'combatPowerIncrease',
                            label: 'combat Power Increase',
                        },
                        { name: 'requiredLevel', label: 'Required Lvl' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value ===
                                                    'boolean' ||
                                                typeof field.value ===
                                                    'undefined' ||
                                                field.value === null
                                                    ? undefined
                                                    : field.value
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                {/* ----- str trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'str', label: 'str' },
                        { name: 'flameStr', label: 'flame str' },
                        { name: 'starStr', label: 'star str' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- dex trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'dex', label: 'dex' },
                        { name: 'flameDex', label: 'flame dex' },
                        { name: 'starDex', label: 'star dex' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- int trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'int', label: 'int' },
                        { name: 'flameInt', label: 'flame int' },
                        { name: 'starInt', label: 'star int' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- luk trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'luk', label: 'luk' },
                        { name: 'flameLuk', label: 'flame luk' },
                        { name: 'starLuk', label: 'star luk' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- maxHP trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'maxHP', label: 'maxHP' },
                        { name: 'flameMaxHP', label: 'flame maxHP' },
                        { name: 'starMaxHP', label: 'star maxHP' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- maxMP trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'maxMP', label: 'maxMP' },
                        { name: 'flameMaxMP', label: 'flame maxMP' },
                        { name: 'starMaxMP', label: 'star maxMP' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- attackPower trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'attackPower', label: 'attack Power' },
                        {
                            name: 'flameAttackPower',
                            label: 'flame attack Power',
                        },
                        { name: 'starAttackPower', label: 'star attack Power' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- magicAttackPower trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        {
                            name: 'magicAttackPower',
                            label: 'magic attack Power',
                        },
                        {
                            name: 'flameMagicAttackPower',
                            label: 'flame magic attack Power',
                        },
                        {
                            name: 'starMagicAttackPower',
                            label: 'star magic attack Power',
                        },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- allStat trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        { name: 'allStat', label: 'all stat' },
                        {
                            name: 'flameAllStat',
                            label: 'flame all stat',
                        },
                        // { name: 'starAllStat', label: 'star all Stat' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- bossDamage trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        // { name: 'bossDamage', label: 'boss Damage' },
                        {
                            name: 'flameBossDamage',
                            label: 'flame boss Damage',
                        },
                        // { name: 'starAllStat', label: 'star all Stat' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- ignoreEnemyDefense trio ----- */}
                <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                        // { name: 'bossDamage', label: 'boss Damage' },
                        {
                            name: 'flameIgnoreEnemyDefense',
                            label: 'ignore Enemy Defense Flame',
                        },
                        // { name: 'starAllStat', label: 'star all Stat' },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof GearSchema}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={
                                                typeof field.value === 'boolean'
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
                </div>

                {/* ----- JSON blobs ----- */}
                {(['potential'] as const).map((fieldName) => (
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
                                    <Textarea
                                        rows={3}
                                        placeholder={'{"line1":"INT +12%"}'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                <Button type='submit' disabled={isPending} className='w-full'>
                    {isPending ? 'Saving…' : 'Add gear'}
                </Button>
            </form>
        </Form>
    )
}
