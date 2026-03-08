'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Server,
  ShoppingCart,
  BookOpen,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Shield,
  Zap,
  FileText,
  Tag,
  ChevronRight,
} from 'lucide-react';

const NAV = [
  {
    section: 'ОБЗОР',
    items: [
      { label: 'Главная', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'УПРАВЛЕНИЕ',
    items: [
      { label: 'Серверы', href: '/dashboard/servers', icon: Server },
      { label: 'Заказы', href: '/dashboard/orders', icon: ShoppingCart },
    ],
  },
  {
    section: 'ТАБЛИЦА ЛИДЕРОВ',
    items: [
      { label: 'База читеров', href: '/dashboard/cheaters', icon: Shield },
    ],
  },
  {
    section: 'РЕСУРСЫ',
    items: [
      { label: 'Тарифы', href: '/dashboard/pricing', icon: Tag },
      { label: 'Обновления', href: '/dashboard/updates', icon: Zap },
      { label: 'Вики', href: '/dashboard/wiki', icon: BookOpen },
      { label: 'Поддержка', href: '/dashboard/support', icon: MessageSquare },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[#1a1a1f] border border-white/[0.08] text-white"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[220px] flex flex-col
          border-r border-white/10 overflow-hidden
          transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.3] contrast-125"
            style={{ backgroundImage: 'url(/sidebar-bg.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/90 to-black/95" />
          <div className="absolute inset-0 bg-purple-950/25" />
        </div>

        {/* Logo */}
        <div className="relative z-10 px-5 py-5 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">MellAC</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 tracking-wider">ЛИЧНЫЙ КАБИНЕТ</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <p className="text-[10px] font-semibold text-purple-500 tracking-widest px-3 mb-1.5">
                {section}
              </p>
              <div className="space-y-0.5">
                {items.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                        ${active
                          ? 'bg-purple-600/15 text-white border border-purple-500/20'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-purple-400' : ''}`} />
                      <span>{label}</span>
                      {active && <ChevronRight className="h-3 w-3 ml-auto text-purple-400/60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="relative z-10 border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.04] transition-colors group">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-purple-300 font-semibold">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user?.username}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
              title="Выход"
            >
              <LogOut className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
