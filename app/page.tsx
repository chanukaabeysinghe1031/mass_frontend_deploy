import Header from '@/components/navbar/header';

export default function Home() {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Header/>
            <section className='bg-green-600 dark:bg-blue-700 min-h-screen pt-20'>
                <div
                    className='max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-md h-[20rem] flex justify-center items-center shadow-lg'>
                    <div className='text-center px-4'>
                        <h1 className='text-5xl font-bold mb-4 text-black dark:text-white'>
                            Welcome to TimNirmal SaaS
                        </h1>
                        <p className='text-xl font-light text-black dark:text-white'>
                            Implement Authentication with Supabase in Next.js 14
                        </p>
                        <button className='mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
