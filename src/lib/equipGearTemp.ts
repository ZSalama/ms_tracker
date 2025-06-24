'use server'
import { Character, GearItem } from '@prisma/client'
import {
	calculateFlameScore,
	refreshCharacterFlameScore,
} from './calculateFlames'
import { prisma } from './prisma'
import { gearTypes } from '../types/gearTypes'
import { secondaryNames, weaponNames } from '@/types/gearNames'

type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}

export const equipGear = async ({ character, gear }: EquipGearButtonProps) => {
	const gearItemFlameScore = calculateFlameScore(character, gear)
	// Check if the gear is already equipped
	console.log('equipGear calculated flame score:', gearItemFlameScore)

	const calculatedType = await calculateType(gear.type)

	try {
		prisma.gearItem.update({
			where: { id: gear.id },
			data: {
				isEquipped: 'equipped',
				totalFlameScore: gearItemFlameScore,
				type: calculatedType, // Ensure the type is set correctly
				slot: gear.slot || '1',
			},
		})

		await refreshCharacterFlameScore(character.id)
		return { ok: true, message: 'Gear item updated successfully' }
	} catch (error) {
		console.error('Error updating gear item:', error)
		return { ok: false, message: 'Failed to update gear item' }
		// Recalculate the character's total flame score
	}
}
// when trying to unequip gear, we need to ensure that the gear being unequipped is the one currently equipped for that type
// and that it is not already unequipped
export const unequipGear = async ({
	character,
	gear,
}: EquipGearButtonProps) => {
	console.log('Unequipping gear:', gear.id)
	// Check if the gear is currently equipped
	const currentEquippedGear = await prisma.gearItem.findFirst({
		where: {
			characterId: character.id,
			isEquipped: 'equipped',
			type: gear.type, // Ensure we only look for the same type of gear
		},
	})
	if (!currentEquippedGear) {
		console.log('No currently equipped gear found for this type:', gear.type)
		return
	}
	console.log('Current equipped gear:', currentEquippedGear.id)
	// If the gear is equipped, unequip it
	await prisma.gearItem.update({
		where: { id: currentEquippedGear.id },
		data: { isEquipped: 'notEquipped', slot: '1' },
	})
	console.log('Unequipped gear:', currentEquippedGear.id)
	// Recalculate the character's total flame score
	// const newScore = await refreshCharacterFlameScore(character.id)
	// console.log('New flame score calculated:', newScore)
	return currentEquippedGear.slot // Return the slot of the unequipped gear
}

export async function calculateType(gearType: string) {
	if (gearTypes.includes(gearType)) {
		return gearType
	}

	if (secondaryNames.includes(gearType)) {
		return 'Secondary'
	}

	if (weaponNames.includes(gearType)) {
		return 'Weapon'
	}
	return ''
}

export const calculateSlotAndEquip = async ({
	character,
	gear,
}: EquipGearButtonProps) => {
	// Determine the slot based on the gear type
	console.log(
		'Calculating slot for gear:',
		gear.type,
		gear.type.toLowerCase().replace(/\s/g, '')
	)
	switch (gear.type.toLowerCase().replace(/\s/g, '')) {
		case 'weapon':
			return replaceSingleSlot(character, gear, 'weapon')
		case 'hat':
			return replaceSingleSlot(character, gear, 'hat')
		case 'earrings':
			return replaceSingleSlot(character, gear, 'earrings')
		case 'medal':
			return replaceSingleSlot(character, gear, 'medal')
		case 'shoulder':
			return replaceSingleSlot(character, gear, 'shoulder')
		case 'top':
			return replaceSingleSlot(character, gear, 'top')
		case 'bottom':
			return replaceSingleSlot(character, gear, 'bottom')
		case 'overall':
			return replaceSingleSlot(character, gear, 'overall')
		case 'gloves':
			return replaceSingleSlot(character, gear, 'gloves')
		case 'cape':
			return replaceSingleSlot(character, gear, 'cape')
		case 'belt':
			return replaceSingleSlot(character, gear, 'belt')
		case 'faceaccessory':
			return replaceSingleSlot(character, gear, 'faceaccessory')
		case 'emblem':
			return replaceSingleSlot(character, gear, 'emblem')
		case 'eyeaccessory':
			return replaceSingleSlot(character, gear, 'eyeaccessory')
		case 'badge':
			return replaceSingleSlot(character, gear, 'badge')
		case 'android':
			return replaceSingleSlot(character, gear, 'android')
		case 'mechanicalheart':
			return replaceSingleSlot(character, gear, 'mechanicalheart')
		case 'shoes':
			return replaceSingleSlot(character, gear, 'shoes')
		case 'pocketitem':
			return replaceSingleSlot(character, gear, 'pocketitem')
		case 'ring':
			{
				// 1. Get all rings that are currently equipped for this character
				const equippedRings = await prisma.gearItem.findMany({
					where: {
						characterId: character.id,
						type: 'ring',
						isEquipped: 'equipped',
					},
					orderBy: { slot: 'asc' }, // ring1 → ring4
				})

				// 2. Slot names in the order we prefer to fill them
				const ringSlots = ['ring1', 'ring2', 'ring3', 'ring4']

				// 3. All four slots full → unequip the first one and reuse slot 1
				if (equippedRings.length === 4) {
					await unequipGear({ character, gear: equippedRings[0] }) // frees ring1
					// return 'ring1'
					await equipGear({
						character,
						gear: {
							...gear,
							isEquipped: 'equipped',
							slot: 'ring1', // reuse ring1 slot
						},
					})
				}

				// 4. Otherwise find the first empty slot
				const occupied = new Set(equippedRings.map((r) => r.slot))
				for (const slot of ringSlots) {
					if (!occupied.has(slot)) {
						await equipGear({
							character,
							gear: {
								...gear,
								isEquipped: 'equipped',
								slot: `${slot}`, // reuse ring1 slot
							},
						}) // e.g. if ring1 + ring3 are used, returns ring2
					}
				}

				// Fallback (shouldn’t happen, but keeps TypeScript happy)
				await equipGear({
					character,
					gear: {
						...gear,
						isEquipped: 'equipped',
						slot: 'ring1', // reuse ring1 slot
					},
				})
			}
			break
		case 'pendant':
			const equippedPendants = await prisma.gearItem.findMany({
				where: {
					characterId: character.id,
					type: 'pendant',
					isEquipped: 'equipped',
				},
				orderBy: {
					slot: 'asc',
				},
			})

			if (equippedPendants.length === 2) {
				await unequipGear({ character, gear: equippedPendants[0] })
				await equipGear({
					character,
					gear: {
						...gear,
						isEquipped: 'equipped',
						slot: 'pendant1',
					},
				})
			} else if (equippedPendants.length === 1) {
				if (equippedPendants[0].slot === 'pendant1') {
					await equipGear({
						character,
						gear: {
							...gear,
							isEquipped: 'equipped',
							slot: 'pendant2',
						},
					})
				} else {
					await equipGear({
						character,
						gear: {
							...gear,
							isEquipped: 'equipped',
							slot: 'pendant1',
						},
					})
				}
			} else {
				await equipGear({
					character,
					gear: {
						...gear,
						isEquipped: 'equipped',
						slot: 'pendant1',
					},
				})
			}
			break

		default:
			return '1' // Default slot if type is unknown
	}
}

async function replaceSingleSlot(
	character: Character,
	gear: GearItem,
	slot: string
) {
	await unequipGear({ character, gear: { ...gear, slot } })
	await equipGear({ character, gear: { ...gear, slot } })
}
