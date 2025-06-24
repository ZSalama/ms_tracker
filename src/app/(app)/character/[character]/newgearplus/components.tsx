'use client'
import { useDropzone } from '@uploadthing/react'
import { useCallback, useState } from 'react'
import {
	generateClientDropzoneAccept,
	generatePermittedFileTypes,
} from 'uploadthing/client'

import { useUploadThing } from '@/utils/useUploadThing'
import { addGearItemPlus } from './actions'
import { Button } from '@/components/ui/button'
import { FaArrowCircleDown } from 'react-icons/fa'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MultiUploader({ character }: { character: string }) {
	const [files, setFiles] = useState<File[]>([])
	const [gearUrl, setGearUrl] = useState<string | null>(null)
	const [uploadedState, setUploadedState] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [imageUpload, setImageUpload] = useState(false)

	const router = useRouter()

	const handleAnalyse = async (fastAnalysis: string) => {
		// setFastAnalysis(false)
		setIsSubmitting(true)
		if (gearUrl) {
			const res = await addGearItemPlus(character, gearUrl, fastAnalysis)
			if (res.ok) {
				router.push(`/character/${character}/newgearplus/${res.gearId}`)
			} else {
				console.error('Error adding gear item:')
				alert('Failed to add gear item. Please try again.')
			}
		}
	}

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles(acceptedFiles)
	}, [])

	const { startUpload, routeConfig } = useUploadThing('dropZoneUploader', {
		onClientUploadComplete: (res) => {
			const { uploadedBy, fileUrl } = res[0].serverData

			setGearUrl(fileUrl)
			// alert('Upload Completed')
			setUploadedState(true)
		},
		onUploadError: () => {
			alert('error occurred while uploading')
		},
		onUploadBegin: (fileKey: string) => {
			console.log('upload has begun for', fileKey)
			setImageUpload(true)
		},
	})

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: generateClientDropzoneAccept(
			generatePermittedFileTypes(routeConfig).fileTypes
		),
	})

	return (
		<>
			<div
				{...getRootProps()}
				className='w-full h-96 bg-gray-300 flex flex-col justify-center items-center 
				hover:bg-gray-800 transition-colors duration-300 cursor-pointer
				rounded-lg hover:text-gray-200 text-4xl gap-5'
			>
				<input {...getInputProps()} />
				<FaArrowCircleDown className='text-9xl transition-colors duration-300' />
				Drop files here!
			</div>
			{files.length > 0 && (
				<Button
					onClick={() => startUpload(files)}
					className='w-50 cursor-pointer mt-8'
					disabled={uploadedState || isSubmitting || imageUpload}
				>
					Upload {files.length} files
				</Button>
			)}
			{uploadedState && (
				<div className='flex flex-col items-center justify-center'>
					<h1 className='text-2xl font-bold text-white'>Upload Completed</h1>
					<Button
						onClick={() => handleAnalyse('slow')}
						disabled={!gearUrl || isSubmitting}
						className='cursor-pointer mb-4'
					>
						{isSubmitting ? (
							<>
								<Loader2 className='animate-spin' /> Analysing...
							</>
						) : (
							'Analyse Gear Item Slow'
						)}
					</Button>
					<Button
						onClick={() => handleAnalyse('fast')}
						disabled={!gearUrl || isSubmitting}
						className='cursor-pointer'
					>
						{isSubmitting ? (
							<>
								<Loader2 className='animate-spin' /> Analysing...
							</>
						) : (
							'Analyse Gear Item Fast'
						)}
					</Button>
				</div>
			)}
		</>
	)
}
