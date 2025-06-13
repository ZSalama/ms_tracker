import type { GearItem } from '@prisma/client'
import ViewGear from '@/components/ViewGear/ViewGear'

type Props = { gear: GearItem }

export function GearItemCard({ gear }: Props) {
	return <ViewGear {...gear} />
}
