'use client'
import {
	getGears,
	GetGearsResponse,
} from '@/app/(app)/character/[character]/actions'
import { editGearItem } from './actions'
import { allGearNames } from '@/types/gearNames'
import { gearTypes } from '@/types/gearTypes'
import { gearSchema, GearSchema } from '@/lib/validators/gear'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'
import { useWatch } from 'react-hook-form'
import { hatNames, hatNamesWarrior } from '@/types/gearNamesHat'

type Props = { data: GetGearsResponse; gearId: string; characterName: string }
export function EditGearForm({ data, gearId, characterName }: Props) {
	const [activeGearNames, setActiveGearNames] = React.useState<string[]>([
		'default',
	])
	const queryClient = useQueryClient()
	const [isPending, startTransition] = useTransition()

	const specificGear = data.gears.filter(
		(gear) => String(gear.id) === gearId
	)[0]

	const router = useRouter()

	const allGearNamesValLab = allGearNames.map((gearName) => [
		gearName,
		gearName.toLowerCase(),
	])

	const form = useForm<GearSchema>({
		resolver: zodResolver(gearSchema),
		defaultValues: {
			name: specificGear?.name,
			starForce: specificGear?.starForce,
			type: specificGear?.type,
			rarity: specificGear?.rarity,
			attackPowerIncrease: specificGear?.attackPowerIncrease,
			combatPowerIncrease: specificGear?.combatPowerIncrease,
			requiredLevel: specificGear?.requiredLevel,

			potType1: specificGear?.potType1 ?? '',
			potType2: specificGear?.potType2 ?? '',
			potType3: specificGear?.potType3 ?? '',

			potValue1: specificGear?.potValue1 ?? '',
			potValue2: specificGear?.potValue2 ?? '',
			potValue3: specificGear?.potValue3 ?? '',

			isEquipped: specificGear?.isEquipped,

			totalStr: specificGear.totalStr ?? 0,
			baseStr: specificGear?.baseStr ?? 0,
			flameStr: specificGear?.flameStr ?? 0,
			starStr: specificGear?.starStr ?? 0,

			totalDex: specificGear.totalDex ?? 0,
			baseDex: specificGear?.baseDex ?? 0,
			flameDex: specificGear?.flameDex ?? 0,
			starDex: specificGear?.starDex ?? 0,

			totalInt: specificGear.totalInt ?? 0,
			baseInt: specificGear?.baseInt ?? 0,
			flameInt: specificGear?.flameInt ?? 0,
			starInt: specificGear?.starInt ?? 0,

			totalLuk: specificGear.totalLuk ?? 0,
			baseLuk: specificGear?.baseLuk ?? 0,
			flameLuk: specificGear?.flameLuk ?? 0,
			starLuk: specificGear?.starLuk ?? 0,

			totalMaxHP: specificGear.totalMaxHP ?? 0,
			baseMaxHP: specificGear?.baseMaxHP ?? 0,
			flameMaxHP: specificGear?.flameMaxHP ?? 0,
			starMaxHP: specificGear?.starMaxHP ?? 0,
			baseMaxMP: specificGear?.baseMaxMP ?? 0,
			flameMaxMP: specificGear?.flameMaxMP ?? 0,
			starMaxMP: specificGear?.starMaxMP ?? 0,

			baseAttackPower: specificGear?.baseAttackPower ?? 0,
			flameAttackPower: specificGear?.flameAttackPower ?? 0,
			starAttackPower: specificGear?.starAttackPower ?? 0,

			baseMagicAttackPower: specificGear?.baseMagicAttackPower ?? 0,
			flameMagicAttackPower: specificGear?.flameMagicAttackPower ?? 0,
			starMagicAttackPower: specificGear?.starMagicAttackPower ?? 0,

			baseAllStat: specificGear?.baseAllStat ?? 0,
			flameAllStat: specificGear?.flameAllStat ?? 0,
			baseBossDamage: specificGear?.baseBossDamage ?? 0,
			flameBossDamage: specificGear?.flameBossDamage ?? 0,
			baseIgnoreEnemyDefense: specificGear?.baseIgnoreEnemyDefense ?? 0,
			flameIgnoreEnemyDefense: specificGear?.flameIgnoreEnemyDefense ?? 0,
		},
	})
	//const jobGearNames =
	useEffect(() => {
		switch (data.character.job) {
			case 'Warrior':
				switch (form.getValues('type')) {
					case 'Hat':
						setActiveGearNames(hatNamesWarrior)
						break
					default:
					//setActiveGearNames([''])
				}
				break
			default:
				//setActiveGearNames([''])
				break
		}
	}, [form.getValues('type')])

	const selectedType = useWatch({
		control: form.control,
		name: 'type',
	})

	async function onSubmit(values: GearSchema) {
		startTransition(async () => {
			try {
				const formData = new FormData()
				Object.entries(values).forEach(([k, v]) =>
					formData.append(k, String(v))
				)
				const res = await editGearItem(
					formData,
					data.character.id,
					Number(gearId)
				)
				if (!res.ok) {
					throw new Error('Failed to update gear')
				}
				queryClient.invalidateQueries({
					queryKey: ['gears', characterName],
				})
				router.push(`/character/${characterName}`)
				toast(
					<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
						<code className='text-white'>
							{JSON.stringify(values, null, 2)}
						</code>
					</pre>
				)
			} catch (error) {
				console.error('Form submission error', error)
				toast.error('Failed to submit the form. Please try again.')
			}
		})
	}
	console.log('type in field', form.getValues('type'))
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 py-10'>
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
									<SelectTrigger>{field.value}</SelectTrigger>
									<SelectContent>
										{gearTypes.map((t) => (
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
				<NameField form={form} activeGearNames={activeGearNames} />
				<Button type='submit' disabled={isPending} className='cursor-pointer'>
					{isPending ? 'Saving…' : 'Update gear'}
				</Button>
			</form>
		</Form>
	)
}

type FormFieldProps = {
	form: ReturnType<typeof useForm<GearSchema>>
	activeGearNames: string[]
}

function NameField({ form, activeGearNames }: FormFieldProps) {
	return (
		<FormField
			control={form.control}
			name='name'
			render={({ field }) => (
				<FormItem>
					<FormLabel>Name</FormLabel>
					<FormControl>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<SelectTrigger>{field.value}</SelectTrigger>
							<SelectContent>
								{activeGearNames.map((t) => (
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
	)
}
