'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { gearSchema, GearSchema } from '@/lib/validators/gear'
import { editGearItem } from './actions'

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
import { startTransition, useTransition } from 'react'
import { GearItem } from '@prisma/client'
import { gearTypes } from '@/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getGears } from '../../actions'
import { redirect } from 'next/navigation'

type Props = { characterName: string; gearId: string }

export function EditGearFormClient({ characterName, gearId }: Props) {
	const [isPending, startTransition] = useTransition()
	const { data, isLoading, isError } = useSuspenseQuery({
		queryKey: ['gears', characterName],
		queryFn: () => getGears(characterName),
	})
	const gearData = data.gears.find(
		(gear: GearItem) => gear.id === Number(gearId)
	)
	/* ---------------- RHF setup ---------------- */
	const form = useForm<GearSchema>({
		resolver: zodResolver(gearSchema),
		defaultValues: {
			name: gearData?.name,
			starForce: gearData?.starForce,
			type: gearData?.type,
			rarity: gearData?.rarity,
			attackPowerIncrease: gearData?.attackPowerIncrease,
			combatPowerIncrease: gearData?.combatPowerIncrease,
			requiredLevel: gearData?.requiredLevel,
			potential1: gearData?.potential1 ?? { type: '', value: '' },
			potential2: gearData?.potential2 ?? { type: '', value: '' },
			potential3: gearData?.potential3 ?? { type: '', value: '' },
			isEquipped: gearData?.isEquipped,

			// totalStr: gearData.totalStr ?? 0,
			baseStr: gearData?.baseStr ?? 0,
			flameStr: gearData?.flameStr ?? 0,
			starStr: gearData?.starStr ?? 0,

			// totalDex: gearData.totalDex ?? 0,
			baseDex: gearData?.baseDex ?? 0,
			flameDex: gearData?.flameDex ?? 0,
			starDex: gearData?.starDex ?? 0,

			// totalInt: gearData.totalInt ?? 0,
			baseInt: gearData?.baseInt ?? 0,
			flameInt: gearData?.flameInt ?? 0,
			starInt: gearData?.starInt ?? 0,

			// totalLuk: gearData.totalLuk ?? 0,
			baseLuk: gearData?.baseLuk ?? 0,
			flameLuk: gearData?.flameLuk ?? 0,
			starLuk: gearData?.starLuk ?? 0,

			// totalMaxHP: gearData.totalMaxHP ?? 0,
			baseMaxHP: gearData?.baseMaxHP ?? 0,
			flameMaxHP: gearData?.flameMaxHP ?? 0,
			starMaxHP: gearData?.starMaxHP ?? 0,
			baseMaxMP: gearData?.baseMaxMP ?? 0,
			flameMaxMP: gearData?.flameMaxMP ?? 0,
			starMaxMP: gearData?.starMaxMP ?? 0,

			baseAttackPower: gearData?.baseAttackPower ?? 0,
			flameAttackPower: gearData?.flameAttackPower ?? 0,
			starAttackPower: gearData?.starAttackPower ?? 0,

			baseMagicAttackPower: gearData?.baseMagicAttackPower ?? 0,
			flameMagicAttackPower: gearData?.flameMagicAttackPower ?? 0,
			starMagicAttackPower: gearData?.starMagicAttackPower ?? 0,

			baseAllStat: gearData?.baseAllStat ?? 0,
			flameAllStat: gearData?.flameAllStat ?? 0,
			baseBossDamage: gearData?.baseBossDamage ?? 0,
			flameBossDamage: gearData?.flameBossDamage ?? 0,
			baseIgnoreEnemyDefense: gearData?.baseIgnoreEnemyDefense ?? 0,
			flameIgnoreEnemyDefense: gearData?.flameIgnoreEnemyDefense ?? 0,
		},
	})

	async function onSubmit(values: GearSchema) {
		startTransition(async () => {
			if (!gearData?.characterId) {
				throw new Error('Character ID is undefined')
			}

			// Convert values object to FormData
			const formData = new FormData()
			Object.entries(values).forEach(([key, value]) => {
				// Handle nested objects (e.g., potential1, potential2, potential3)
				if (
					typeof value === 'object' &&
					value !== null &&
					!Array.isArray(value)
				) {
					Object.entries(value).forEach(([subKey, subValue]) => {
						formData.append(`${key}.${subKey}`, subValue ?? '')
					})
				} else {
					formData.append(key, (value as string) ?? '')
				}
			})

			const result = await editGearItem(
				formData,
				gearData.characterId,
				Number(gearId)
			)

			if (result?.error) {
				Object.entries(result.error).forEach(([field, messages]) =>
					form.setError(field as keyof GearSchema, {
						message: (messages as string[])[0],
					})
				)
			} else if (result?.success) {
				redirect(`/character/${characterName}/dashboard`)
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

				{/* ──────────────────────────────────────────────────────────────── */}
				{/* Potentials                                                     */}
				{/* ──────────────────────────────────────────────────────────────── */}

				{/* helper so we don’t repeat the same JSX three times */}
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
							name={`potential${idx}.type`}
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
							name={`potential${idx}.value`}
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
