'use client';

import {LoginUserInput, loginUserSchema} from '@/lib/user-schema';
import {zodResolver} from '@hookform/resolvers/zod';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState, useTransition} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {signInWithEmailAndPassword} from '../_actions';
import toast from 'react-hot-toast';
import useSupabaseClient from '@/lib/supabase/client';
import {FiEye, FiEyeOff} from 'react-icons/fi';

export const LoginForm = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const supabase = useSupabaseClient();

    const methods = useForm<LoginUserInput>({
        resolver: zodResolver(loginUserSchema),
    });

    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
    } = methods;

    const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
        startTransition(async () => {
            const result = await signInWithEmailAndPassword(values);
            const parsedResult = JSON.parse(result);
            const {error, data} = parsedResult;

            if (error) {
                const errorMessage = error.message || 'There was an error with the login. Please try again.';
                setError(errorMessage);
                // toast.error(errorMessage);
                // reset({ password: '' });
                return;
            }

            if (data?.user) {
                setError('');
                toast.success('Successfully logged in');
                router.push('/');
            }
        });
    };

    const loginWithGitHub = () => {
        supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    const loginWithGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    const input_style =
        'form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            {error && (
                <p className='text-center bg-red-300 py-4 mb-6 rounded'>{error}</p>
            )}
            <div className='mb-6'>
                <input
                    type='email'
                    {...register('email')}
                    placeholder='Email address'
                    className={`${input_style}`}
                />
                {errors['email'] && (
                    <span className='text-red-500 text-xs pt-1 block'>
                        {errors['email']?.message as string}
                    </span>
                )}
            </div>
            <div className='mb-6 relative'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder='Password'
                    className={`${input_style} pr-12`} // Add padding to the right to make room for the icon
                />
                <div
                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FiEyeOff/> : <FiEye/>}
                </div>
                {errors['password'] && (
                    <span className='text-red-500 text-xs pt-1 block'>
                        {errors['password']?.message as string}
                    </span>
                )}
            </div>
            <button
                type='submit'
                style={{backgroundColor: `${isPending ? '#ccc' : '#3446eb'}`}}
                className='inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full'
                disabled={isPending}
            >
                {isPending ? 'Loading...' : 'Sign In'}
            </button>

            <div
                className='flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5'>
                <p className='text-center font-semibold mx-4 mb-0'>OR</p>
            </div>

            <a
                className='px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3'
                style={{backgroundColor: '#3b5998'}}
                onClick={loginWithGoogle}
                role='button'
            >
                <Image
                    className='pr-2'
                    src='/images/google.svg'
                    alt=''
                    style={{height: '2rem'}}
                    width={35}
                    height={35}
                />
                Continue with Google
            </a>
            <a
                className='px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center'
                style={{backgroundColor: '#55acee'}}
                onClick={loginWithGitHub}
                role='button'
            >
                <Image
                    className='pr-2'
                    src='/images/github.svg'
                    alt=''
                    width={40}
                    height={40}
                />
                Continue with GitHub
            </a>
        </form>
    );
};
