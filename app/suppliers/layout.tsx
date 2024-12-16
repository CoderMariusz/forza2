import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import TopToolBar from '../TopToolBar';
import { ClerkProvider } from '@clerk/nextjs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

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
  return (
    <ClerkProvider
      dynamic
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      allowedRedirectOrigins={[
        'https://www.forza2demo.co.uk',
        'https://forza2demo.co.uk'
      ]}>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div>
            <SidebarProvider>
              <AppSidebar />
              <main className='flex flex-col w-full h-screen'>
                <SidebarTrigger />
                <TopToolBar />
                {children}
              </main>
            </SidebarProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
