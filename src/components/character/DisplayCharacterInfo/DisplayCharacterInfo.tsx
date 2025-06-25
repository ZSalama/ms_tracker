import { Character } from '@prisma/client'
import { DeleteCharacterButton } from '../DeleteCharacterButton/DeleteCharacterButton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { SignedIn } from '@clerk/nextjs'

export function CharacterCharacterInfo({
	characterProp,
	userId,
	internalUser,
}: {
	characterProp: Character
	userId: string | null | undefined
	internalUser: { id: number; email: string; clerkId: string } | null
}) {
	return (
		<Card className='mr-8 w-full h-full'>
			{/* ---------- HEADER ---------- */}
			<div className='flex flex-col h-full gap-4'>
				<CardHeader>
					<CardTitle className='text-3xl'>{characterProp.name}</CardTitle>
				</CardHeader>

				{/* ---------- BODY ---------- */}
				<CardContent>
					<dl className='space-y-1'>
						<div>
							<dt className='inline font-medium'>Level:</dt>{' '}
							<dd className='inline'>{characterProp.level}</dd>
						</div>
						<div>
							<dt className='inline font-medium'>Class:</dt>{' '}
							<dd className='inline'>{characterProp.class}</dd>
						</div>
						<div>
							<dt className='inline font-medium'>Combat Power:</dt>{' '}
							<dd className='inline'>
								{characterProp.combatPower.toLocaleString()}
							</dd>
						</div>
						<div>
							<dt className='inline font-medium'>Flame Score:</dt>{' '}
							<dd className='inline'>
								{characterProp.totalFlameScore.toLocaleString()}
							</dd>
						</div>
					</dl>
				</CardContent>
			</div>

			{/* ---------- FOOTER (optional) ---------- */}
			<SignedIn>
				<CardFooter className='flex flex-col gap-4'>
					<Link
						href={`/character/${characterProp.name}/newgearplus`}
						className='w-full'
					>
						<Button className='w-full cursor-pointer'>+ Add New Gear</Button>
					</Link>

					<Link
						href={`/character/${characterProp.name}/edit-character`}
						className='w-full'
					>
						<Button className='w-full cursor-pointer'>Edit Character</Button>
					</Link>

					<DeleteCharacterButton characterName={characterProp.name} />
				</CardFooter>
			</SignedIn>
		</Card>
	)
}
