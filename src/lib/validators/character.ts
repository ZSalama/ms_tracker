import { z } from 'zod'

export const characterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    level: z.coerce.number().min(1).max(300),
    class: z.string().min(1),
    combatPower: z.coerce.number().min(0),
    arcaneForce: z.coerce.number().min(0),
    sacredPower: z.coerce.number().min(0),
})
export type CharacterSchema = z.infer<typeof characterSchema>
