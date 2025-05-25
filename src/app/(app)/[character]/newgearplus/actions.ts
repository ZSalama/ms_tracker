'use server'

// import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
// import { gearSchema } from '@/lib/validators/gear'
import { redirect } from 'next/navigation'

export async function addGearItemPlus(characterName: string, url: string) {
    const character = await prisma.character.findFirst({
        where: { name: characterName },
        select: { id: true, name: true },
    })
    if (!character) redirect('/')
    /* 4. Persist ------------------------------------------------------------ */
    const gear = await prisma.gearItem.create({
        data: {
            /* ─── linkage & meta ─────────────────────────────── */
            // characterId: character.id,
            character: { connect: { id: character.id } },
            name: '',
            type: '',
            rarity: '',
            tradeStatus: 'untradeable',
            starForce: 0,
            requiredLevel: 0,
            isEquipped: false,

            url: url,

            /* ─── progression bonuses ────────────────────────── */
            attackPowerIncrease: 0,
            combatPowerIncrease: 0,

            /* ─── main stats ─────────────────────────────────── */
            str: 0,
            flameStr: 0,
            starStr: 0,

            dex: 0,
            flameDex: 0,
            starDex: 0,

            int: 0,
            flameInt: 0,
            starInt: 0,

            luk: 0,
            flameLuk: 0,
            starLuk: 0,

            /* ─── HP / MP ────────────────────────────────────── */
            maxHP: 0,
            flameMaxHP: 0,
            starMaxHP: 0,

            maxMP: 0,
            flameMaxMP: 0,
            starMaxMP: 0,

            /* ─── offensive / defensive ──────────────────────── */
            attackPower: 0,
            flameAttackPower: 0,
            starAttackPower: 0,

            magicAttackPower: 0,
            flameMagicAttackPower: 0,
            starMagicAttackPower: 0,

            defense: null,
            flameDefense: null,
            starDefense: null,

            /* ─── mobility ───────────────────────────────────── */
            jump: null,
            flameJump: null,
            starJump: null,

            speed: null,
            flameSpeed: null,
            starSpeed: null,

            /* ─── percentage-based lines (Strings in Prisma) ─── */
            allStat: 0,
            flameAllStat: 0,
            starAllStat: 0,

            bossDamage: 0,
            flameBossDamage: 0,
            starBossDamage: 0,

            ignoreEnemyDefense: 0,
            flameIgnoreEnemyDefense: 0,

            /* ─── JSON block ─────────────────────────────────── */
            potential: {},
        },
    })

    /* 5. Redirect – Next will client-navigate automatically ---------------- */
    redirect(`/${character.name}/newgearplus/${gear.id}`)
    // return { success: true, gearId: gear.id }
}
