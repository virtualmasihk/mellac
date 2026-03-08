'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold">MellAC</h1>
        <p className="text-gray-400">Загрузка...</p>
      </div>
    </main>
  );
}
