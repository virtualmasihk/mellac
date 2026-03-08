'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background image with overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: 'url(/main-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/80 to-purple-950/60" />
        <div className="absolute inset-0 bg-[#0d0d0f]/40" />
      </div>

      <Sidebar />
      <div className="lg:pl-[220px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-8">
          <div />
          <Button className="bg-purple-600 hover:bg-purple-500 text-white text-sm h-9 px-4 gap-2 rounded-lg font-medium">
            <Download className="h-3.5 w-3.5" />
            Скачать плагин
          </Button>
        </header>
        <main className="relative z-10 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
