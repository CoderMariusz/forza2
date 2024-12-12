import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import TopToolBar from './TopToolBar';
import LeftSideMenu, { MenuItem } from './LeftSideMenu';
import { auth } from '@clerk/nextjs/server';
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Forza Dashboard',
  description: 'Create by Mariusz Krawczyk'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sampleMenuItem: MenuItem = {
    Home: ['Dashboard', 'Profile'],
    Favorite: ['Preferences', 'Security'],
    Help: null,
    Module: ['Quarantine', 'BoM', 'Warehouse']
  };

  const { userId } = await auth();

  return (
    <ClerkProvider dynamic>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div>
            <TopToolBar />
            <LeftSideMenu menuItems={sampleMenuItem} />
          </div>
          <div className='pl-[160px] pt-12'>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
