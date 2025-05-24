'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { gearSchema } from '@/lib/validators/gear'
import { redirect } from 'next/navigation'

export async function createGearItem(formData: FormData, characterId: number) {
    // console.log('createGearItem', formData)
    /* 1. Clerk auth --------------------------------------------------------- */
    const { userId: clerkId } = await auth()
    if (!clerkId) throw new Error('Unauthenticated')

    /* 2. Zod validation ----------------------------------------------------- */
    const parsed = gearSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }
    const data = parsed.data

    /* 3. Character ownership check ----------------------------------------- */
    const character = await prisma.character.findFirst({
        where: { id: characterId },
        select: { id: true, name: true },
    })
    // console.log('character', character)
    if (!character) redirect('/')

    /* 4. Persist ------------------------------------------------------------ */
    await prisma.gearItem.create({
        data: {
            /* ─── linkage & meta ─────────────────────────────── */
            // characterId: character.id,
            character: { connect: { id: character.id } },
            name: data.name,
            type: data.type,
            rarity: data.rarity,
            tradeStatus: 'untradeable',
            starForce: Number(data.starForce),
            requiredLevel: Number(data.requiredLevel),
            isEquipped: Boolean(data.isEquipped),

            /* ─── progression bonuses ────────────────────────── */
            attackPowerIncrease: Number(data.attackPowerIncrease),
            combatPowerIncrease: Number(data.combatPowerIncrease),

            /* ─── main stats ─────────────────────────────────── */
            str: Number(data.str) ?? null,
            flameStr: Number(data.flameStr) ?? null,
            starStr: Number(data.starStr) ?? null,

            dex: Number(data.dex) ?? null,
            flameDex: Number(data.flameDex) ?? null,
            starDex: Number(data.starDex) ?? null,

            int: Number(data.int) ?? null,
            flameInt: Number(data.flameInt) ?? null,
            starInt: Number(data.starInt) ?? null,

            luk: Number(data.luk) ?? null,
            flameLuk: Number(data.flameLuk) ?? null,
            starLuk: Number(data.starLuk) ?? null,

            /* ─── HP / MP ────────────────────────────────────── */
            maxHP: Number(data.maxHP) ?? null,
            flameMaxHP: Number(data.flameMaxHP) ?? null,
            starMaxHP: Number(data.starMaxHP) ?? null,

            maxMP: Number(data.maxMP) ?? null,
            flameMaxMP: Number(data.flameMaxMP) ?? null,
            starMaxMP: Number(data.starMaxMP) ?? null,

            /* ─── offensive / defensive ──────────────────────── */
            attackPower: Number(data.attackPower) ?? null,
            flameAttackPower: Number(data.flameAttackPower) ?? null,
            starAttackPower: Number(data.starAttackPower) ?? null,

            magicAttackPower: Number(data.magicAttackPower) ?? null,
            flameMagicAttackPower: Number(data.flameMagicAttackPower) ?? null,
            starMagicAttackPower: Number(data.starMagicAttackPower) ?? null,

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
            allStat: Number(data.allStat) ?? undefined,
            flameAllStat: Number(data.flameAllStat) ?? undefined,
            starAllStat: Number(data.starAllStat) ?? undefined,

            bossDamage: Number(data.bossDamage) ?? undefined,
            flameBossDamage: Number(data.flameBossDamage) ?? undefined,
            starBossDamage: Number(data.starBossDamage) ?? undefined,

            ignoreEnemyDefense: Number(data.ignoreEnemyDefense) ?? undefined,
            flameIgnoreEnemyDefense:
                Number(data.flameIgnoreEnemyDefense) ?? undefined,

            /* ─── JSON block ─────────────────────────────────── */
            potential: data.potential ? JSON.parse(data.potential) : {},
        },
    })

    /* 5. Redirect – Next will client-navigate automatically ---------------- */
    redirect(`/${character.name}`)
    return { success: true }
}
