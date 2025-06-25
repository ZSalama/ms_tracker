import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
	const { userId } = await auth()
	if (!userId) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}
	const client = await clerkClient()
	try {
		await client.users.updateUserMetadata(userId, {
			publicMetadata: {
				role: 'user',
			},
		})
	} catch (error) {
		console.error('Error updating user metadata:', error)
		return Response.json(
			{ error: 'Failed to update user metadata' },
			{ status: 500 }
		)
	}

	return Response.json({ success: true })
}
