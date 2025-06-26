'use server'
import { Character, GearItem } from '@prisma/client'
import { prisma } from './prisma'
import { gearTypes } from '@/types/gearTypes'
import { secondaryNames, weaponNames } from '@/types/gearNames'
import { refreshCharacterFlameScore } from './calculateFlames'

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
		if (existingGear.type !== 'Ring' && existingGear.type !== 'Pendant') {
			await unequipGear({ character, gear: existingGear })
			console.log('Unequipped existing gear:', existingGear.id)
			await prisma.gearItem.update({
				where: { id: gear.id },
				data: {
					isEquipped: 'equipped',
					slot: await calculateSlot(gear.type), // Ensure slot is set
				},
			})
			await refreshCharacterFlameScore(character.id)
			return { ok: true, message: 'Gear item equipped successfully' }
		}
		if (existingGear.type === 'Ring') {
			console.log('Existing ring found:', existingGear.id)
			console.log('character ring list', character.equippedRingsIds)
			const parsedRings = JSON.parse(character.equippedRingsIds)
			if (parsedRings.length >= 4) {
				const removedRing = parsedRings.pop() // Remove the last ring
				if (removedRing) {
					//await unequipGear({ character, gear: removedRing })
					await prisma.gearItem.update({
						where: { id: removedRing },
						data: { isEquipped: 'notEquipped', slot: '1' },
					})
					await refreshCharacterFlameScore(character.id)
					console.log('Unequipped ring:', removedRing.id)
				}
			}
			parsedRings.push(gear.id) // Add the new ring
			await prisma.character.update({
				where: { id: character.id },
				data: { equippedRingsIds: JSON.stringify(parsedRings) },
			})
			await prisma.gearItem.update({
				where: { id: gear.id },
				data: {
					isEquipped: 'equipped',
					slot: await calculateSlot(gear.type, parsedRings.length), // Ensure slot is set
				},
			})
			await refreshCharacterFlameScore(character.id)
			return { ok: true, message: 'Ring equipped successfully' }
		}
		if (existingGear.type === 'Pendant') {
			console.log('Existing pendant found:', existingGear.id)
			console.log('character pendant list', character.equippedPendantsIds)
			const parsedPendants = JSON.parse(character.equippedPendantsIds)
			if (parsedPendants.length >= 2) {
				const removedPendant = parsedPendants.pop() // Remove the last pendant
				if (removedPendant) {
					//await unequipGear({ character, gear: removedPendant })
					await prisma.gearItem.update({
						where: { id: removedPendant },
						data: { isEquipped: 'notEquipped', slot: '1' },
					})
					await refreshCharacterFlameScore(character.id)

					console.log('Unequipped pendant:', removedPendant.id)
				}
			}
			parsedPendants.push(gear.id) // Add the new pendant
			await prisma.character.update({
				where: { id: character.id },
				data: { equippedPendantsIds: JSON.stringify(parsedPendants) },
			})
			await prisma.gearItem.update({
				where: { id: gear.id },
				data: {
					isEquipped: 'equipped',
					slot: await calculateSlot(gear.type, parsedPendants.length), // Ensure slot is set
				},
			})
			await refreshCharacterFlameScore(character.id)
			return { ok: true, message: 'Pendant equipped successfully' }
		}
	} else {
		console.log('No existing gear found, equipping new gear:', gear.id)

		if (gear.type === 'Ring') {
			const parsedRings = JSON.parse(character.equippedRingsIds)
			parsedRings.push(gear.id) // Add the new ring
			await prisma.character.update({
				where: { id: character.id },
				data: { equippedRingsIds: JSON.stringify(parsedRings) },
			})
			await prisma.gearItem.update({
				where: { id: gear.id },
				data: {
					isEquipped: 'equipped',
					slot: 'ring1', // Ensure slot is set
				},
			})
		} else if (gear.type === 'Pendant') {
			const parsedPendants = JSON.parse(character.equippedPendantsIds)
			parsedPendants.push(gear.id) // Add the new pendant
			await prisma.character.update({
				where: { id: character.id },
				data: { equippedPendantsIds: JSON.stringify(parsedPendants) },
			})
			await prisma.gearItem.update({
				where: { id: gear.id },
				data: {
					isEquipped: 'equipped',
					slot: 'pendant1', // Ensure slot is set
				},
			})
		} else {
			await prisma.gearItem.update({
				where: { id: gear.id },
				data: {
					isEquipped: 'equipped',
					slot: await calculateSlot(gear.type), // Ensure slot is set
				},
			})
		}

		await refreshCharacterFlameScore(character.id)
		return { ok: true, message: 'Gear item equipped successfully' }
	}
	return { ok: true }
}

export const reAssignRingSlotName = async (character: Character) => {
	const parsedRings = JSON.parse(character.equippedRingsIds)
	if (parsedRings.length === 0) {
		return
	}

	for (let i = 0; i < parsedRings.length; i++) {
		const ringId = parsedRings[i]
		await prisma.gearItem.update({
			where: { id: ringId },
			data: { slot: `ring${i + 1}` }, // Assign slot name
		})
	}
	await refreshCharacterFlameScore(character.id)
	return { ok: true, message: 'Ring slots reassigned successfully' }
}

export const reAssignPendantSlotName = async (character: Character) => {
	const parsedPendants = JSON.parse(character.equippedPendantsIds)
	if (parsedPendants.length === 0) {
		return
	}
	for (let i = 0; i < parsedPendants.length; i++) {
		const pendantId = parsedPendants[i]
		await prisma.gearItem.update({
			where: { id: pendantId },
			data: { slot: `pendant${i + 1}` }, // Assign slot
		})
	}
	await refreshCharacterFlameScore(character.id)
	return { ok: true, message: 'Pendant slots reassigned successfully' }
}

export const unequipGear = async ({
	character,
	gear,
}: EquipGearButtonProps) => {
	if (gear.isEquipped !== 'equipped') {
		return { ok: false, message: 'Gear item is not equipped' }
	}
	if (gear.type === 'Ring') {
		const parsedRings = JSON.parse(character.equippedRingsIds)
		const ringIndex = parsedRings.indexOf(gear.id)
		if (ringIndex !== -1) {
			parsedRings.splice(ringIndex, 1) // Remove the ring from the array
			await prisma.character.update({
				where: { id: character.id },
				data: { equippedRingsIds: JSON.stringify(parsedRings) },
			})
			await reAssignRingSlotName(character) // Reassign ring slots after unequipping
		}
	} else if (gear.type === 'Pendant') {
		const parsedPendants = JSON.parse(character.equippedPendantsIds)
		const pendantIndex = parsedPendants.indexOf(gear.id)
		if (pendantIndex !== -1) {
			parsedPendants.splice(pendantIndex, 1) // Remove the pendant from the		 array
			await prisma.character.update({
				where: { id: character.id },
				data: { equippedPendantsIds: JSON.stringify(parsedPendants) },
			})
			await reAssignPendantSlotName(character) // Reassign pendant slots after unequipping
		}
	}
	await prisma.gearItem.update({
		where: { id: gear.id },
		data: { isEquipped: 'notEquipped', slot: '1' },
	})

	await refreshCharacterFlameScore(character.id)
	return { ok: true, message: 'Gear item unequipped successfully' }
}

export async function calculateType(gearType: string) {
	const gearTypeLower = gearType.toLocaleLowerCase().replace(' ', '')
	const gearTypesLower = gearTypes.map((type) =>
		type.toLocaleLowerCase().replace(' ', '')
	)
	if (gearTypesLower.includes(gearTypeLower)) {
		return gearType
	}

	if (secondaryNames.includes(gearTypeLower)) {
		return 'Secondary'
	}

	if (weaponNames.includes(gearTypeLower)) {
		return 'Weapon'
	}
	return ''
}

export async function calculateSlot(gearType: string, Index?: number) {
	if (gearType === 'Ring' && Index !== undefined) {
		return `ring${Index}` // Return ring slot based on index
	}
	if (gearType === 'Pendant' && Index !== undefined) {
		return `pendant${Index}` // Return pendant slot
	}

	return gearType.toLocaleLowerCase().replace(' ', '')
}
