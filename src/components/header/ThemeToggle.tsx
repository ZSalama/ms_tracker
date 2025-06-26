'use client'

import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme()

	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	if (!mounted) return null

	const isDark = resolvedTheme === 'dark'

	return (
		<div className='flex items-center gap-2'>
			{!isDark ? (
				<span className='text-sm text-muted-foreground'>Light</span>
			) : (
				<span className='text-sm text-foreground'>Dark</span>
			)}
			<Switch
				checked={isDark}
				onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
				aria-label='Toggle dark mode'
				className='dark'
			/>
		</div>
	)
}
