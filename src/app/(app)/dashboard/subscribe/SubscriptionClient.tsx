'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

export default function SubscriptionClient() {
	const [loading, setLoading] = useState(false)

	const handleSubscribe = async () => {
		setLoading(true)
		const res = await fetch('/api/stripe/checkout', { method: 'POST' })
		const data = await res.json()
		if (data.url) {
			window.location.assign(data.url) // Stripe-hosted page
		} else {
			alert('Something went wrong.')
			setLoading(false)
		}
	}

	return (
		<div className='container mx-auto max-w-md py-16 text-center space-y-6'>
			<h1 className='text-3xl font-bold'>Pro subscription</h1>
			<p className='text-muted-foreground'>$9 / month • cancel anytime</p>
			<Button
				className='w-full cursor-pointer'
				disabled={loading}
				onClick={handleSubscribe}
			>
				{loading ? 'Redirecting…' : 'Subscribe'}
			</Button>
		</div>
	)
}
