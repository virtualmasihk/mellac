'use client';

import { useAuth } from '@/lib/auth-context';
import {
  Server, ShoppingBag, BookOpen, MessageSquare,
  Shield, Zap, Tag, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const CARDS = [
  { label: 'Мои серверы', sub: 'Управляйте серверами', href: '/dashboard/servers', icon: Server, accent: 'purple' },
  { label: 'Магазин', sub: 'Купить лицензию', href: '/dashboard/pricing', icon: ShoppingBag, accent: 'zinc' },
  { label: 'Заказы', sub: 'История покупок', href: '/dashboard/orders', icon: Tag, accent: 'zinc' },
  { label: 'Вики', sub: 'База знаний', href: '/dashboard/wiki', icon: BookOpen, accent: 'zinc' },
  { label: 'Поддержка', sub: 'Связаться с нами', href: '/dashboard/support', icon: MessageSquare, accent: 'zinc' },
  { label: 'Обновления', sub: 'Changelog плагина', href: '/dashboard/updates', icon: Zap, accent: 'zinc' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-[1100px]">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md" style={{ minHeight: 160 }}>
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Purple glow */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 p-8">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2 font-medium">Система мониторинга активна</p>
          <h1 className="text-3xl font-bold text-white leading-tight">
            С возвращением,{' '}
            <span className="text-purple-400">{user?.username}</span>!
          </h1>
          <p className="text-zinc-400 mt-3 max-w-lg text-sm leading-relaxed">
            Управляйте серверами, следите за метриками и обеспечивайте честную игру на ваших Minecraft серверах.
          </p>
        </div>
        {/* Decorative shield icon */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
          <Shield className="w-36 h-36 text-purple-400" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CARDS.map(({ label, sub, href, icon: Icon, accent }) => (
          <Link key={href} href={href}>
            <div className={`group relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer
              bg-black/20 backdrop-blur-md border-white/10
              hover:border-white/20 hover:bg-black/30`}>
              {accent === 'purple' && (
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-purple-600/10 blur-2xl pointer-events-none" />
              )}
              <div className="p-5">
                {/* Icon + arrow */}
                <div className="flex items-start justify-between mb-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${accent === 'purple'
                      ? 'bg-purple-600/20 border border-purple-500/30'
                      : 'bg-white/[0.05] border border-white/[0.08]'}`}>
                    <Icon className={`h-5 w-5 ${accent === 'purple' ? 'text-purple-400' : 'text-zinc-400'}`} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                </div>
                {/* Label */}
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick start guide */}
      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-md p-6">
        <h2 className="text-white font-semibold mb-4 text-sm">Быстрый старт</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            'Создайте сервер',
            'Скопируйте API ключ',
            'Установите плагин',
            'Вставьте ключ в config.yml',
            'Перезагрузите сервер',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] text-purple-300 font-bold">{i + 1}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
