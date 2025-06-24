'use server'
import { Character, GearItem } from '@prisma/client'
import { prisma } from './prisma'
import { gearTypes } from '@/types/gearTypes'
import { secondaryNames, weaponNames } from '@/types/gearNames'
import { ok } from 'assert'

type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}

export const equipGear = async ({ character, gear }: EquipGearButtonProps) => {
	const existingGear = await prisma.gearItem.findFirst({
		where: {
			characterId: character.id,
			type: gear.type,
			isEquipped: 'equipped',
		},
	})

	if (existingGear) {
		console.log('Existing gear found:', existingGear.id)
		if (existingGear.type !== 'ring' && existingGear.type !== 'pendant') {
			await prisma.gearItem.update({
				where: { id: existingGear.id },
				data: { isEquipped: 'notEquipped', slot: '1' },
			})
			console.log('Unequipped existing gear:', existingGear.id)
			await prisma.gearItem.update({
				where: { id: gear.id },
				data: {
					isEquipped: 'equipped',
					slot: await calculateSlot(gear.type), // Ensure slot is set
				},
			})
			return { ok: true, message: 'Gear item equipped successfully' }
		}
		if (existingGear.type === 'ring') {
			console.log('Existing ring found:', existingGear.id)
			console.log('character ring list', character.equippedRingsIds)
		}
	} else {
		console.log('No existing gear found, equipping new gear:', gear.id)
		await prisma.gearItem.update({
			where: { id: gear.id },
			data: {
				isEquipped: 'equipped',
				slot: await calculateSlot(gear.type), // Ensure slot is set
			},
		})
		return { ok: true, message: 'Gear item equipped successfully' }
	}
	return { ok: true }
}

export const unequipGear = async ({
	character,
	gear,
}: EquipGearButtonProps) => {
	if (gear.isEquipped !== 'equipped') {
		return { ok: false, message: 'Gear item is not equipped' }
	}

	await prisma.gearItem.update({
		where: { id: gear.id },
		data: { isEquipped: 'notEquipped', slot: '1' },
	})

	return { ok: true, message: 'Gear item unequipped successfully' }
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

export async function calculateSlot(gearType: string) {
	// This function can be used to determine the slot based on gear type
	// For now, it returns a default value, but you can expand it as needed
	return gearType.toLocaleLowerCase().replace(' ', '')
}

// equipping gear

// 	if there is a gear item already equipped and the new gear item not a ring or pendant
// 		set old gear to notEquipped
// 		equip new gear
// 		return
// --
// 	if ring
// 		if there are 4 rings already in the equippedgear list
// 			popped = list.pop
// 			unequip(popped)
// 			list.push(new ring)
// 			set new ring to equiped
// 			return

// 		if there are less than 4 rings in the equippedgear list
// 			list.push(new ring)
// 			return

// 	if pendant
// 		if there are 2 pendants already equipped in the gear list
// 			popped = list.pop
// 			unequip(popped)
// 			list.push(new pendant)
// 			set new pendant to equiped
// 			return
// --
// 	else
// 		set gear to equipped

// unequipping gear

// 	if ring
// 		remove from equiped list
// 		set gear to notEquiped

// 	if equipped
// 		set gear to notEquiped
