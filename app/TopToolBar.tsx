'use client';
import React from 'react';
import Image from 'next/image';
import { ClerkLoaded, SignInButton, useUser } from '@clerk/nextjs';
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
              <div className='w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white'>
                <span>AB</span>
              </div>
              <a
                href='/settings'
                className='ml-4 text-white transition duration-200 ease-in-out transform hover:scale-105'>
                Settings
              </a>
            </div>
          ) : (
            <SignInButton />
          )}
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default TopToolBar;
