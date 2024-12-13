interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: 'Forza Dashboard',
  description: 'Create by Mariusz Krawczyk'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <div>{children}</div>
      </body>
    </html>
  );
}
