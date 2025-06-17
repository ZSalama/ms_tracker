'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useTransition } from 'react'
import { getGears } from '../../actions'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
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
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GearSchema, gearSchema } from '@/lib/validators/gear'
import { editGearItem } from './actions'
import { allGearNames, gearTypes } from '@/lib/types'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'

type Props = { characterName: string; gearId: string }
export function EditGearFormClient({ characterName, gearId }: Props) {
	const [isPending, startTransition] = useTransition()
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})

	const specificGear = data.gears.filter(
		(gear) => String(gear.id) === gearId
	)[0]

	const languages = [
		{
			label: 'Chinese',
			value: 'zh',
		},
	] as const

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

			// totalStr: specificGear.totalStr ?? 0,
			baseStr: specificGear?.baseStr ?? 0,
			flameStr: specificGear?.flameStr ?? 0,
			starStr: specificGear?.starStr ?? 0,

			// totalDex: specificGear.totalDex ?? 0,
			baseDex: specificGear?.baseDex ?? 0,
			flameDex: specificGear?.flameDex ?? 0,
			starDex: specificGear?.starDex ?? 0,

			// totalInt: specificGear.totalInt ?? 0,
			baseInt: specificGear?.baseInt ?? 0,
			flameInt: specificGear?.flameInt ?? 0,
			starInt: specificGear?.starInt ?? 0,

			// totalLuk: specificGear.totalLuk ?? 0,
			baseLuk: specificGear?.baseLuk ?? 0,
			flameLuk: specificGear?.flameLuk ?? 0,
			starLuk: specificGear?.starLuk ?? 0,

			// totalMaxHP: specificGear.totalMaxHP ?? 0,
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

	async function onSubmit(values: GearSchema) {
		startTransition(async () => {
			try {
				const formData = new FormData()
				Object.entries(values).forEach(([k, v]) =>
					formData.append(k, String(v))
				)
				editGearItem(formData, data.character.id, Number(gearId))
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

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 py-10'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel>Gear Name</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='outline'
											role='combobox'
											className={cn(
												'justify-between',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value
												? allGearNamesValLab.find(
														(language) => language[0] === field.value
												  )?.[0]
												: 'Select gear'}
											<ChevronsUpDown className=' shrink-0 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className=' p-0'>
									<Command>
										<CommandInput placeholder='Search gear...' />
										<CommandList>
											<CommandEmpty>No gear found.</CommandEmpty>
											<CommandGroup>
												{allGearNamesValLab.map((language) => (
													<CommandItem
														value={language[0]}
														key={language[1]}
														onSelect={() => {
															form.setValue('name', language[0])
														}}
													>
														<Check
															className={cn(
																'',
																language[0] === field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														{language[0]}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>
								This is the language that will be used in the dashboard.
							</FormDescription>
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
										<SelectTrigger>{field.value}</SelectTrigger>
										<SelectContent>
											{['Common', 'Rare', 'Epic', 'Unique', 'Legendary'].map(
												(r) => (
													<SelectItem key={r} value={r}>
														{r}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='isEquipped'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Equipped</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>{field.value}</SelectTrigger>
										<SelectContent>
											{['equipped', 'notEquipped'].map((r) => (
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
				</div>

				{/* ----- attackPower trio ----- */}
				<div className='grid gap-4 sm:grid-cols-3'>
					{[
						{ name: 'baseAttackPower', label: 'base attack Power' },
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
				</div>

				{/* ----- magicAttackPower trio ----- */}
				<div className='grid gap-4 sm:grid-cols-3'>
					{[
						{
							name: 'baseMagicAttackPower',
							label: 'base magic attack Power',
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
				</div>
				{([1, 2, 3] as const).map((idx) => (
					<div
						key={idx}
						className='grid gap-4 sm:grid-cols-2 border-t pt-6 mt-6'
					>
						<h4 className='col-span-full font-semibold text-lg'>
							Potential {idx}
						</h4>

						{/* -- type ---------------------------------------------------- */}
						<FormField
							control={form.control}
							name={`potType${idx}`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value ?? ''}
										>
											<SelectTrigger>
												{field.value || 'Select type'}
											</SelectTrigger>
											<SelectContent>
												{[
													'Critical Damage',
													'Boss Damage',
													'Max HP',
													'Max MP',
													'Attack',
													'Magic Attack',
													'Str',
													'Dex',
													'Int',
													'Luk',
													'All Stat',
													'Ignore Enemy Defense',
													'Damage',
													'Critical Rate',
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

						{/* -- value --------------------------------------------------- */}
						<FormField
							control={form.control}
							name={`potValue${idx}`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input placeholder='+8%' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				))}
				<Button type='submit' disabled={isPending} className='cursor-pointer'>
					{isPending ? 'Saving…' : 'Update gear'}
				</Button>
			</form>
		</Form>
	)
}
