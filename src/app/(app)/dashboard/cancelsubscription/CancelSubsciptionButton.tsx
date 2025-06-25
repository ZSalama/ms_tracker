'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button' // shadcn/ui button
import { toast } from 'sonner' // or any toast lib

type Props = {
	/** The Stripe subscription ID to cancel (e.g. "sub_…") */
	subscriptionId: string
}

/**
 * Renders a button that cancels a user’s active Stripe subscription.
 * Place this inside any client component where you already know the user’s
 * subscription ID (you can fetch it with React Query or load it in a server–
 * component parent and pass it down as a prop).
 */
export default function CancelSubscriptionButton({ subscriptionId }: Props) {
	const [isLoading, setIsLoading] = useState(false)

	const handleCancel = async () => {
		setIsLoading(true)
		try {
			const res = await fetch('/api/stripe/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ subscriptionId }),
			})

			if (!res.ok) {
				const { error } = await res.json()
				throw new Error(error ?? 'Unknown error')
			}

			toast.success('Your subscription will be cancelled.')
			// If you cache subscription data with TanStack Query etc.:
			// queryClient.invalidateQueries({ queryKey: ['subscription'] });
		} catch (err) {
			toast.error((err as Error).message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			disabled={isLoading}
			onClick={handleCancel}
			className='cursor-pointer'
		>
			{isLoading ? 'Cancelling…' : 'Cancel subscription'}
		</Button>
	)
}
