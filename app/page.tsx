interface User {
  userHandle: string;
}

export default function Home(user: User) {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <h1 className='text-4xl font-bold text-center'>Forza Dashboard</h1>
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl font-bold'>Welcome!</h2>
          <p>
            This is a dashboard for Forza. It is a project created by Mariusz
            Krawczyk. hi, {user.userHandle}
          </p>
        </div>
      </div>
    </div>
  );
}
