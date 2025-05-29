export default function page() {
    return (
        <div>
            <h1 className='text-4xl font-bold text-center'>Learn</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-4xl mx-auto'>
                <div className=' p-4 rounded-lg shadow my-auto mx-auto'>
                    <div>
                        <h2 className='text-xl font-semibold'>Expected flow</h2>
                        <ol className='list-disc pl-6'>
                            <li>Create character</li>
                            <li>
                                Upload an image to extract gear data
                                <dl> - Provided image can be used to test</dl>
                            </li>
                            <li>Share character progress with friends!</li>
                        </ol>
                        <h2 className='text-lg font-semibold mt-4'>
                            Future plans
                        </h2>
                        <ol className='list-disc pl-6 mt-2'>
                            <li>
                                Uploading image to automatically update
                                character information
                            </li>
                            <li>
                                Snapshot character to monitor progress over time
                            </li>
                            <li>
                                AI chatting agent to suggest optimal character
                                progression
                            </li>
                        </ol>
                        <h2 className='text-lg font-semibold mt-4'>
                            Stack used
                        </h2>
                        <ol className='list-disc pl-6 mt-2'>
                            <li>Next.js 14</li>
                            <li>Vercel</li>
                            <li>Prisma (NeonDB Postgres)</li>
                            <li>Tailwind CSS</li>
                            <li>TypeScript</li>
                            <li>OpenAI API</li>
                            <li>UploadThing</li>
                            <li>Clerk Auth</li>
                            <li>Github</li>
                        </ol>
                        <p className='mt-4'>
                            This project is open source and available on <br />
                            <a
                                href='https://github.com/ZSalama/ms_tracker'
                                target='_blank'
                                className='text-blue-500 hover:underline'
                            >
                                https://github.com/ZSalama/ms_tracker
                            </a>
                        </p>
                    </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src='/gloves.png'
                    alt='testing image'
                    className='flex justify-center mx-auto rounded-lg'
                />
            </div>
        </div>
    )
}
