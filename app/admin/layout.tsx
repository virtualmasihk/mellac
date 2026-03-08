'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Server, Users, Database,
  Shield, LogOut, Activity, Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Обзор',     href: '/admin',          icon: LayoutDashboard },
  { label: 'Серверы',   href: '/admin/servers',  icon: Server },
  { label: 'Пользователи', href: '/admin/users', icon: Users },
  { label: 'База данных',  href: '/admin/database', icon: Database },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'superadmin')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#07070e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Background image with overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: 'url(/main-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-purple-950/70" />
        <div className="absolute inset-0 bg-[#07070e]/50" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-56 shrink-0 flex flex-col bg-black/30 backdrop-blur-xl border-r border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">MellAC</p>
            <p className="text-[10px] text-red-400 mt-0.5 font-medium">ADMIN PANEL</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-white font-medium truncate">{user.username}</p>
            <p className="text-[10px] text-zinc-600 truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center px-6 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Activity className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-500">Система активна</span>
            <span className="mx-2">·</span>
            <span>MellAC Control Panel</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
