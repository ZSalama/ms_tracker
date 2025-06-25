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
	FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'

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
import { useTransition } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { allGearNames, gearTypes } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function NewGearForm({
	character,
	characterId,
}: {
	character: string
	characterId: number
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const allGearNamesValLab = allGearNames.map((gearName) => [
		gearName,
		gearName.toLowerCase(),
	])

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
			isEquipped: 'notEquipped',
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

			potType1: '',
			potType2: '',
			potType3: '',

			potValue1: '',
			potValue2: '',
			potValue3: '',
		},
	})

	async function onSubmit(values: GearSchema) {
		startTransition(async () => {
			try {
				const formData = new FormData()
				Object.entries(values).forEach(([k, v]) =>
					formData.append(k, String(v))
				)
				createGearItem(formData, characterId)
				toast(
					<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
						<code className='text-white'>
							{JSON.stringify(values, null, 2)}
						</code>
					</pre>
				)
			} catch (error) {
				toast.error('Failed to submit the form. Please try again.')
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
				<Link href={`/character/${character}`}>
					<Button className='cursor-pointer'>back to characters</Button>
				</Link>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='hat' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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

				<Button
					type='submit'
					disabled={isPending}
					className='w-full cursor-pointer'
				>
					{isPending ? 'Saving…' : 'Add gear'}
				</Button>
			</form>
		</Form>
	)
}
