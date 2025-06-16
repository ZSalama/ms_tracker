'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type CharacterGearContextType = {
	characterName: string
	setCharacterName: (name: string) => void
	gearId: number | null
	setGearId: (id: number | null) => void
	gearUrl: string | null
	setGearUrl: (url: string | null) => void
	uploadedBy: string | null
	setUploadedBy: (uploadedBy: string | null) => void
	fastAnalysis: boolean
	setFastAnalysis: (fastAnalysis: boolean) => void
}

const CharacterGearContext = createContext<
	CharacterGearContextType | undefined
>(undefined)

export const CharacterGearProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const [characterName, setCharacterName] = useState('')
	const [gearId, setGearId] = useState<number | null>(null)
	const [gearUrl, setGearUrl] = useState<string | null>(null)
	const [uploadedBy, setUploadedBy] = useState<string | null>(null)
	const [fastAnalysis, setFastAnalysis] = useState(false)

	return (
		<CharacterGearContext.Provider
			value={{
				characterName,
				setCharacterName,
				gearId,
				setGearId,
				gearUrl,
				setGearUrl,
				uploadedBy,
				setUploadedBy,
				fastAnalysis,
				setFastAnalysis,
			}}
		>
			{children}
		</CharacterGearContext.Provider>
	)
}

export const useCharacterGear = () => {
	const context = useContext(CharacterGearContext)
	if (!context) {
		throw new Error(
			'useCharacterGear must be used within a CharacterGearProvider'
		)
	}
	return context
}
