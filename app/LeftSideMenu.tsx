'use client';
import React, { useState } from 'react';

export type MenuItem = { [key: string]: string[] | null };

interface LeftSideMenuProps {
  menuItems: MenuItem;
}

const LeftSideMenu: React.FC<LeftSideMenuProps> = ({ menuItems }) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className='fixed text-m font-bold left-0 top-12 h-full w-40 bg-gray-100 text-gray-800'>
      <ul className='pt-6'>
        {Object.entries(menuItems).map(([key, subItems]) => (
          <li
            key={key}
            className='p-1'>
            <div
              onClick={() => toggleExpand(key)}
              className='p-1 pl-2 cursor-pointer transition duration-200 ease-in-out transform hover:bg-slate-400'>
              {key}
            </div>
            {subItems && expanded[key] && (
              <ul className='pl-4'>
                {subItems.map((subItem) => (
                  <li
                    key={subItem}
                    className='p-2 transition duration-200 ease-in-out transform hover:bg-slate-600'>
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSideMenu;
