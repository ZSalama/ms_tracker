'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { gearSchema } from '@/lib/validators/gear'
import { redirect } from 'next/navigation'

export async function createGearItem(formData: FormData) {
    /* 1. Clerk auth --------------------------------------------------------- */
    const { userId: clerkId } = await auth()
    if (!clerkId) throw new Error('Unauthenticated')

    /* 2. Zod validation ----------------------------------------------------- */
    const parsed = gearSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }
    const data = parsed.data

    /* 3. Character ownership check ----------------------------------------- */
    const character = await prisma.character.findFirst({
        where: { id: data.characterId, user: { clerkId } },
        select: { id: true },
    })
    if (!character) return { errors: { _form: ['Character not found'] } }

    /* 4. Persist ------------------------------------------------------------ */
    await prisma.gearItem.create({
        data: {
            /* ─── linkage & meta ─────────────────────────────── */
            characterId: data.characterId,
            name: data.name,
            type: data.type,
            rarity: data.rarity,
            tradeStatus: data.tradeStatus ?? 'untradeable',
            starForce: Number(data.starForce),
            requiredLevel: Number(data.requiredLevel),
            isEquipped: Boolean(data.isEquipped),

            /* ─── progression bonuses ────────────────────────── */
            attackPowerIncrease: Number(data.attackPowerIncrease),
            combatPowerIncrease: Number(data.combatPowerIncrease),

            /* ─── main stats ─────────────────────────────────── */
            str: Number(data.str),
            flameStr: Number(data.flameStr),
            starStr: Number(data.starStr),

            Dex: Number(data.Dex),
            flameDex: Number(data.flameDex),
            starDex: Number(data.starDex),

            int: Number(data.int),
            flameint: Number(data.flameint),
            starint: Number(data.starint),

            LUK: Number(data.LUK),
            flameLUK: Number(data.flameLUK),
            starLUK: Number(data.starLUK),

            /* ─── HP / MP ────────────────────────────────────── */
            maxHP: Number(data.maxHP),
            flameMaxHP: Number(data.flameMaxHP),
            starMaxHP: Number(data.starMaxHP),

            maxMP: Number(data.maxMP),
            flameMaxMP: Number(data.flameMaxMP),
            starMaxMP: Number(data.starMaxMP),

            /* ─── offensive / defensive ──────────────────────── */
            attackPower: Number(data.attackPower),
            flameAttackPower: Number(data.flameAttackPower),
            starAttackPower: Number(data.starAttackPower),

            magicAttackPower: Number(data.magicAttackPower),
            flameMagicAttackPower: Number(data.flameMagicAttackPower),
            starMagicAttackPower: Number(data.starMagicAttackPower),

            defense: Number(data.defense),
            flameDefense: Number(data.flameDefense),
            starDefense: Number(data.starDefense),

            /* ─── mobility ───────────────────────────────────── */
            jump: Number(data.jump),
            flameJump: Number(data.flameJump),
            starJump: Number(data.starJump),

            speed: Number(data.speed),
            flameSpeed: Number(data.flameSpeed),
            starSpeed: Number(data.starSpeed),

            /* ─── percentage-based lines (Strings in Prisma) ─── */
            allStat: String(data.allStat),
            flameAllStat: String(data.flameAllStat),
            starAllStat: String(data.starAllStat),

            bossDamage: String(data.bossDamage),
            flameBossDamage: String(data.flameBossDamage),
            starBossDamage: String(data.starBossDamage),

            ignoreEnemyDefense: String(data.ignoreEnemyDefense),
            flameIgnoreEnemyDefense: String(data.flameIgnoreEnemyDefense),

            /* ─── JSON block ─────────────────────────────────── */
            potential: data.potential ? JSON.parse(data.potential) : {},
        },
    })

    /* 5. Redirect – Next will client-navigate automatically ---------------- */
    redirect(`/dashboard/${character.id}`)
}
