export default function page() {
	return (
		<div>
			<h1 className='text-4xl font-bold text-center'>Learn</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-4xl mx-auto'>
				<div className=' p-4 rounded-lg shadow my-auto mx-auto'>
					<div>
						<h2 className='text-xl font-semibold'>Hello my friends</h2>
						<p className='mt-2'>
							Welcome to my project, a comprehensive tool designed to help you
							track and manage your MapleStory Career! I&apos;ve spent a little
							too much time on this, but I hope you find it useful.
						</p>

						<h2 className='text-lg font-semibold mt-4'>Stack used</h2>
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

						{/* <p className='mt-4'>
							This project is open source at <br />
							<a
								href='https://github.com/ZSalama/ms_tracker'
								target='_blank'
								className='text-blue-500 hover:underline'
							>
								https://github.com/ZSalama/ms_tracker
							</a>
						</p> */}
						<p className='mt-4'>
							For any questions, suggestions or issues, please reach out to me
							at undermouseweb@gmail.com
						</p>
					</div>
				</div>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src='/gloves.PNG'
					alt='testing image'
					className='flex justify-center mx-auto rounded-lg'
				/>
			</div>
		</div>
	)
}
