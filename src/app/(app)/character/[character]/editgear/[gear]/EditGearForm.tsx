import { Suspense } from 'react'
import { EditGearFormClient } from './components'

type Props = { characterName: string; gearId: string }

export default function EditGearForm({ characterName, gearId }: Props) {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<EditGearFormClient characterName={characterName} gearId={gearId} />
		</Suspense>
	)
}
