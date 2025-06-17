'use server'
import { Character, GearItem } from '@prisma/client'
import {
	calculateFlameScore,
	refreshCharacterFlameScore,
} from './calculateFlames'
import { prisma } from './prisma'
// import { redirect } from 'next/navigation'

type EquipGearButtonProps = {
	character: Character
	gear: GearItem
}

export const equipGear = async ({ character, gear }: EquipGearButtonProps) => {
	const gearItemFlameScore = calculateFlameScore(character, gear)
	// Check if the gear is already equipped
	console.log('equipGear calculated flame score:', gearItemFlameScore)

	const existingEquippedGear = await prisma.gearItem.findFirst({
		where: {
			characterId: character.id,
			isEquipped: 'equipped',
			type: gear.type, // Ensure we only look for the same type of gear
		},
	})

	console.log('Existing equipped gear:', existingEquippedGear?.id)

	// If there is already equipped gear, unequip it
	if (existingEquippedGear) {
		await prisma.gearItem.update({
			where: { id: existingEquippedGear.id },
			data: { isEquipped: 'notEquipped', slot: '1' },
		})
	}
	console.log('Unequipped existing gear:', existingEquippedGear?.isEquipped)
	const slot = gear.type.toLocaleLowerCase()

	// Update the current gear to be equipped
	const updatedGear = await prisma.gearItem.update({
		where: { id: gear.id },
		data: {
			isEquipped: 'equipped',
			totalFlameScore: gearItemFlameScore,
			slot: slot,
		},
	})

	console.log('Updated gear:', updatedGear.id)

	// Recalculate the character's total flame score
	const newScore = await refreshCharacterFlameScore(character.id)
	console.log('New flame score calculated:', newScore)

	const res = await prisma.character.update({
		where: { id: character.id },
		data: { totalFlameScore: newScore },
	})
	if (res) {
		console.log(
			'Character flame score updated successfully :',
			res.totalFlameScore
		)
	} else {
		console.error('Failed to update character flame score')
	}
	// redirect(`/character/${character.name}`)
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
	const newScore = await refreshCharacterFlameScore(character.id)
	console.log('New flame score calculated:', newScore)

	// const currentEquippedGear = await prisma.gearItem.findFirst({
	// 	where: {
	// 		characterId: character.id,
	// 		isEquipped: 'equipped',
	// 		type: gear.type, // Ensure we only look for the same type of gear
	// 	},
	// })

	// if (currentEquippedGear) {
	// 	const updatedGear = await prisma.gearItem.update({
	// 		where: { id: gear.id },
	// 		data: { isEquipped: 'notEquipped', slot: '1' },
	// 	})

	// 	console.log('Unequipped gear:', updatedGear.id)

	// 	// Recalculate the character's total flame score
	// 	const newScore = await refreshCharacterFlameScore(character.id)
	// 	console.log('New flame score calculated:', newScore)
	// }

	// redirect(`/character/${character.name}`)
}
