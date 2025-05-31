'use client'

import { UploadButton } from '@/utils/uploadthing'
// import { redirect } from 'next/navigation'
import { useCharacterGear } from '@/context/CharacterGearContext'
import { ClientUploadedFileData } from 'uploadthing/types'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addGearItemPlus } from './actions'
import { Loader2 } from 'lucide-react'

export default function Uploader({ character }: { character: string }) {
    const {
        // characterName,
        setCharacterName,
        // gearId,
        // setGearId,
        gearUrl,
        setGearUrl,
        // uploadedBy,
        setUploadedBy,
    } = useCharacterGear()

    const [uploadedState, setUploadedState] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAnalyse = async () => {
        setIsSubmitting(true)
        if (gearUrl) {
            try {
                await addGearItemPlus(character, gearUrl)
            } catch (error) {
                console.error('Error adding gear item:', error)
                // alert('Failed to add gear item. Please try again.')
            }
        }
    }

    return (
        <>
            <div className='flex flex-col items-center justify-between p-24 m-24 bg-gray-800'>
                <UploadButton
                    endpoint='imageUploader'
                    onClientUploadComplete={(
                        res: ClientUploadedFileData<{
                            uploadedBy: string
                            fileUrl: string
                        }>[]
                    ) => {
                        // Do something with the response
                        console.log('Files: ', res)

                        const { uploadedBy, fileUrl } = res[0].serverData

                        // Example: redirect user to a success page
                        // redirect('/')
                        // const { gearId } = await addGearItemPlus(character, res[0].fileUrl)
                        setCharacterName(character)
                        setGearUrl(fileUrl)
                        setUploadedBy(uploadedBy)
                        alert('Upload Completed')
                        setUploadedState(true)
                    }}
                    onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`)
                    }}
                />
            </div>
            {uploadedState && (
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-2xl font-bold text-white'>
                        Upload Completed
                    </h1>
                    <Button
                        onClick={handleAnalyse}
                        disabled={!gearUrl || isSubmitting}
                        className='cursor-pointer'
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className='animate-spin' />{' '}
                                Analysing...
                            </>
                        ) : (
                            'Analyse Gear Item'
                        )}
                    </Button>
                </div>
            )}
        </>
    )
}
