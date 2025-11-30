'use client';

import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-zinc-50">Verification</h2>
        <p className="text-gray-700 dark:text-zinc-300">ID: {id}</p>
      </div>
    </div>
  );
}
