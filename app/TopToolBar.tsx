import React from 'react';
import Image from 'next/image';

const TopToolBar: React.FC = () => {
  return (
    <div className='fixed top-0 w-full h-12 bg-blue-500 flex items-center justify-between px-4'>
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
      {/* <div className="flex-grow mx-4">
                <input type="text" placeholder="Search..." className="w-full px-2 py-1 rounded" />
            </div> */}

      {/* Right side: User info */}
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
    </div>
  );
};

export default TopToolBar;
