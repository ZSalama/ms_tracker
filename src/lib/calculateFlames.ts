import { Character, GearItem } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { GearSchema } from './validators/gear'

// calculate flame score using character's flame weights
export const calculateFlameScore = (
	character: Character,
	gear: GearSchema | GearItem
) => {
	let flameMainStat = 0
	switch (character.flameWeightMainType) {
		case 'str':
			flameMainStat = gear.flameStr ?? 0
			break
		case 'dex':
			flameMainStat = gear.flameDex ?? 0
			break
		case 'int':
			flameMainStat = gear.flameInt ?? 0
			break
		case 'luk':
			flameMainStat = gear.flameLuk ?? 0
			break
		default:
			flameMainStat = 0 // No main stat, return 0
	}

	let flameSubStat = 0
	switch (character.flameWeightSubType) {
		case 'str':
			flameSubStat = Math.floor(
				(gear.flameStr ?? 0) / character.flameWeightMainStat
			)
			break
		case 'dex':
			flameSubStat = Math.floor(
				(gear.flameDex ?? 0) / character.flameWeightMainStat
			)
			break
		case 'int':
			flameSubStat = Math.floor(
				(gear.flameInt ?? 0) / character.flameWeightMainStat
			)
			break
		case 'luk':
			flameSubStat = Math.floor(
				(gear.flameLuk ?? 0) / character.flameWeightMainStat
			)
			break
		default:
			flameMainStat = 0 // No main stat, return 0
	}

	const flameAllStat = (gear.flameAllStat ?? 0) * character.flameWeightAllStat

	const flameBossDamage =
		(gear.flameBossDamage ?? 0) * character.flameWeightDamage
	// const AllStatScore =
	// 	(character.flameWeightMainType === 'str') ? (data.flameStr ?? 0 * character.flameWeightMainStat) : 0

	return flameMainStat + flameSubStat + flameAllStat + flameBossDamage
}

export async function getCharacterFlameScore(
	characterId: number
): Promise<number> {
	const { _sum } = await prisma.gearItem.aggregate({
		where: { characterId, isEquipped: true },
		_sum: { totalFlameScore: true },
	})

	// When the character has no gear, _sum.totalFlameScore is null
	return _sum.totalFlameScore ?? 0
}

export async function refreshCharacterFlameScore(
	characterId: number
): Promise<number> {
	const sum = await getCharacterFlameScore(characterId)

	await prisma.character.update({
		where: { id: characterId },
		data: { totalFlameScore: sum },
	})

	return sum
}
