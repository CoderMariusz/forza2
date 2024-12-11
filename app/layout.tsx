import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import TopToolBar from './TopToolBar';
import LeftSideMenu, { MenuItem } from './LeftSideMenu';

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

export default function RootLayout({
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

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TopToolBar />
        <LeftSideMenu menuItems={sampleMenuItem} />
        {children}
      </body>
    </html>
  );
}
