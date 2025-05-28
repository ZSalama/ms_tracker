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
import Link from 'next/link'

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
            baseStr: 0,
            flameStr: 0,
            starStr: 0,
            baseDex: 0,
            flameDex: 0,
            starDex: 0,
            baseInt: 0,
            flameInt: 0,
            starInt: 0,
            baseLuk: 0,
            flameLuk: 0,
            starLuk: 0,
            baseMaxHP: 0,
            flameMaxHP: 0,
            starMaxHP: 0,
            baseMaxMP: 0,
            flameMaxMP: 0,
            starMaxMP: 0,
            baseAttackPower: 0,
            flameAttackPower: 0,
            starAttackPower: 0,
            baseMagicAttackPower: 0,
            flameMagicAttackPower: 0,
            starMagicAttackPower: 0,
            baseAllStat: 0,
            flameAllStat: 0,
            baseBossDamage: 0,
            flameBossDamage: 0,
            baseIgnoreEnemyDefense: 0,
            flameIgnoreEnemyDefense: 0,
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
                <Link href={`/${character}`}>
                    <Button className='cursor-pointer'>
                        back to characters
                    </Button>
                </Link>
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
                                                'Eye Accessory',
                                                'Earrings',
                                                'Shoulder',
                                                'Gloves',
                                                'Weapon',
                                                'Secondary',
                                                'Hat',
                                                'Cape',
                                                'Shoes',
                                                'Top',
                                                'Bottom',
                                                'Pendant',
                                                'Mechanical Heart',
                                                'Belt',
                                                'Emblem',
                                                'Pocket Item',
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
                        { name: 'baseStr', label: 'base str' },
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
                        { name: 'baseDex', label: 'base dex' },
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
                        { name: 'baseInt', label: 'base int' },
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
                        { name: 'baseLuk', label: 'base luk' },
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
                        { name: 'baseMaxHP', label: 'base maxHP' },
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
                        { name: 'baseMaxMP', label: 'base maxMP' },
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
                        { name: 'baseAttackPower', label: 'attack Power' },
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
                            name: 'baseMagicAttackPower',
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
                        { name: 'baseAllStat', label: 'base all stat' },
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
                        { name: 'baseBossDamage', label: 'boss Damage' },
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
                        {
                            name: 'baseIgnoreEnemyDefense',
                            label: 'base Ignore Enemy Defense',
                        },
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
