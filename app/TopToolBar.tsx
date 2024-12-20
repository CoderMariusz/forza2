'use client';
import React from 'react';
import Image from 'next/image';
import {
  ClerkLoaded,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser
} from '@clerk/nextjs';
import Form from 'next/form';
import { SearchIcon } from '@sanity/icons';

const TopToolBar: React.FC = () => {
  const { user } = useUser();

  console.log(user);

  return (
    <div className='flex w-full fixed top-0 right-0'>
      <div className='h-12 bg-blue-500 flex items-center justify-between px-4 flex-shrink-0 w-full'>
        {/* Left side: Logo */}
        <div className='flex items-center'>
          <Image
            src='/vercel.svg'
            alt='Forza Logo'
            width={24}
            height={24}
          />
          <span className='ml-2 text-gray-800 font-bold'>FORZA</span>
        </div>

        {/* Middle: Searcher (to be implemented later) */}
        <div className=' mx-4'>
          <Form
            action={'/search'}
            className='w-full flex sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0'>
            <input
              type='text'
              name='query'
              className='w-full sm:w-auto bg-gray-200 text-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search...'
            />
            <SearchIcon className='w-10 h-10 text-gray-200' />
          </Form>
        </div>

        {/* Right side: User info */}
        <ClerkLoaded>
          {user ? (
            <div className='flex items-center'>
              <UserButton />
              <div className='bg-blue-700 rounded-lg ml-2 p-2 text-gray-300  shadow-lg'>
                <SignOutButton />
              </div>
            </div>
          ) : (
            <SignInButton mode='modal' />
          )}
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default TopToolBar;
