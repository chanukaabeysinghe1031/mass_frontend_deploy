'use client';

import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';

const ProfileDropdown = ({session}: { session: any }) => {
    const router = useRouter();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const supabase = getSupabaseBrowserClient();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const logoutAction = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setDropdownOpen(false);
    };

    return (
        <div className='relative'>
            <button onClick={toggleDropdown} className='flex items-center space-x-2'>
                <img
                    src='/images/profile_icon.png'  // Replace with actual path to user's profile image
                    alt='Profile'
                    className='w-8 h-8 rounded-full'
                />
                {/*<span className='text-gray-800 dark:text-white'>Profile</span>*/}
            </button>
            {isDropdownOpen && (
                <ul className='absolute -right-4 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg'>
                    <li>
                        <Link href='/profile'
                              className='block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link href='/settings'
                              className='block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                            Settings
                        </Link>
                    </li>
                    <li>
                        <button onClick={logoutAction}
                                className='w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                            Logout
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ProfileDropdown;
