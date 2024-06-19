import Link from 'next/link';
import getUserSession from '@/lib/getUserSession';
import {ModeToggle} from "@/components/mode-toggle";
import ProfileDropdown from '@/components/navbar/ProfileDropdown';

const Header = async () => {
    const {data} = await getUserSession();

    return (
        <header className='bg-white dark:bg-gray-800 shadow-md'>
            <nav className='container mx-auto flex justify-between items-center h-20 px-4'>
                <div>
                    <Link href='/public' className='text-gray-800 dark:text-white text-2xl font-semibold'>
                        TimNirmal
                    </Link>
                </div>
                <div className='flex-1 flex justify-center'>
                    <ul className='flex items-center space-x-4'>
                        <li>
                            <Link href='/public'
                                  className='text-gray-800 dark:text-white hover:text-green-500 dark:hover:text-green-500'>
                                Home
                            </Link>
                        </li>
                        {!data.session && (
                            <>
                                <li>
                                    <Link href='/register'
                                          className='text-gray-800 dark:text-white hover:text-green-500 dark:hover:text-green-500'>
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/login'
                                          className='text-gray-800 dark:text-white hover:text-green-500 dark:hover:text-green-500'>
                                        Login
                                    </Link>
                                </li>
                            </>
                        )}
                        {data.session && (
                            <>
                                <Link href='/dashboard'
                                      className='text-gray-800 dark:text-white hover:text-green-500 dark:hover:text-green-500'>
                                    Dashboard
                                </Link>
                            </>
                        )}
                    </ul>
                </div>
                <div className='flex items-center space-x-4'>
                    <ModeToggle/>
                    {data.session && (
                        <ProfileDropdown session={data.session}/>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
