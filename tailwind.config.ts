/** @type {import('tailwindcss').Config} */
export default {
	// still needed for class-based toggling (next-themes, etc.)
	darkMode: 'class',

	// optional in v4 (auto-detects templates), but explicit never hurts
	content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],

	theme: { extend: {} },
	plugins: [],
}
