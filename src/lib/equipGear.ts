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

	console.log('Existing equipped gear:', existingEquippedGear)

	// If there is already equipped gear, unequip it
	if (existingEquippedGear) {
		await prisma.gearItem.update({
			where: { id: existingEquippedGear.id },
			data: { isEquipped: 'notEquipped' },
		})
	}
	console.log('Unequipped existing gear:', existingEquippedGear?.isEquipped)

	// Update the current gear to be equipped
	const updatedGear = await prisma.gearItem.update({
		where: { id: gear.id },
		data: {
			isEquipped: 'equipped',
			totalFlameScore: gearItemFlameScore,
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
