export type Stat = 'str' | 'dex' | 'int' | 'luk' | 'hp'
export type AttackType = 'Attack' | 'Magic'

export const classStats: Record<
	string,
	{ main: Stat; sub: Stat; attackType: AttackType }
> = {
	// Warriors
	Hero: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Paladin: { main: 'str', sub: 'dex', attackType: 'Attack' },
	'Dark Knight': { main: 'str', sub: 'dex', attackType: 'Attack' },
	'Dawn Warrior': { main: 'str', sub: 'dex', attackType: 'Attack' },
	Mihile: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Aran: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Kaiser: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Adele: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Zero: { main: 'str', sub: 'dex', attackType: 'Attack' },
	'Sia Astelle': { main: 'str', sub: 'dex', attackType: 'Attack' },
	Khali: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Lynn: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Ark: { main: 'str', sub: 'dex', attackType: 'Attack' },

	// Paladins & Dark Knights share the same, so they’re listed above

	// Pirates (Str-based)
	Buccaneer: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Corsair: { main: 'str', sub: 'dex', attackType: 'Attack' },
	Cannoneer: { main: 'str', sub: 'dex', attackType: 'Attack' },
	'Thunder Breaker': { main: 'str', sub: 'dex', attackType: 'Attack' },
	Mechanic: { main: 'str', sub: 'dex', attackType: 'Attack' },

	// Demon
	'Demon Slayer': { main: 'str', sub: 'dex', attackType: 'Attack' },
	'Demon Avenger': { main: 'hp', sub: 'str', attackType: 'Attack' },
	Xenon: { main: 'dex', sub: 'luk', attackType: 'Attack' },

	// Archers (Dex-based)
	Bowmaster: { main: 'dex', sub: 'luk', attackType: 'Attack' },
	Marksman: { main: 'dex', sub: 'luk', attackType: 'Attack' },
	Pathfinder: { main: 'dex', sub: 'luk', attackType: 'Attack' },
	'Wind Archer': { main: 'dex', sub: 'luk', attackType: 'Attack' },
	'Wild Hunter': { main: 'dex', sub: 'luk', attackType: 'Attack' },
	Mercedes: { main: 'dex', sub: 'luk', attackType: 'Attack' },
	Lara: { main: 'dex', sub: 'luk', attackType: 'Attack' },

	// Thieves (Luk-based)
	'Night Lord': { main: 'luk', sub: 'dex', attackType: 'Attack' },
	Shadower: { main: 'luk', sub: 'dex', attackType: 'Attack' },
	'Dual Blade': { main: 'luk', sub: 'dex', attackType: 'Attack' },
	'Night Walker': { main: 'luk', sub: 'dex', attackType: 'Attack' },
	Phantom: { main: 'luk', sub: 'dex', attackType: 'Attack' },
	Cadena: { main: 'luk', sub: 'dex', attackType: 'Attack' },
	Hoyoung: { main: 'luk', sub: 'dex', attackType: 'Attack' },
	'Mo Xuan': { main: 'luk', sub: 'dex', attackType: 'Attack' },
	Shade: { main: 'luk', sub: 'dex', attackType: 'Attack' },

	// Magicians (Int-based)
	'Fire Poison': { main: 'int', sub: 'luk', attackType: 'Magic' },
	'Ice Lightning': { main: 'int', sub: 'luk', attackType: 'Magic' },
	Bishop: { main: 'int', sub: 'luk', attackType: 'Magic' },
	'Blaze Wizard': { main: 'int', sub: 'luk', attackType: 'Magic' },
	'Battle Mage': { main: 'int', sub: 'luk', attackType: 'Magic' },
	Evan: { main: 'int', sub: 'luk', attackType: 'Magic' },
	Luminous: { main: 'int', sub: 'luk', attackType: 'Magic' },
	Illium: { main: 'int', sub: 'luk', attackType: 'Magic' },
	Kinesis: { main: 'int', sub: 'luk', attackType: 'Magic' },
	Kanna: { main: 'int', sub: 'luk', attackType: 'Magic' },

	// Mix-&-match or special cases
	Blaster: { main: 'str', sub: 'dex', attackType: 'Attack' },
	// …you get the idea for the rest
}
