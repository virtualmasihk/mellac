'use client';

import { useState } from 'react';
// router not needed — auth-context handles redirect
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, Shield, AlertCircle, BarChart2, Key } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    if (result.error) setError(result.error);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#05050f] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-64 h-64 bg-indigo-800/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-purple-900/30">
              <Shield className="w-6 h-6 text-purple-300" />
            </div>
            <div className="absolute -inset-1 bg-purple-600/20 rounded-xl blur-md -z-10" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">MellAC</span>
            <p className="text-xs text-purple-400/80 -mt-0.5">Anti-Cheat System</p>
          </div>
        </div>

        {/* Glass card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

          <div className="p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white mb-1">Добро пожаловать</h1>
              <p className="text-sm text-zinc-400">Войдите в панель управления MellAC</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Пароль</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 mt-2 rounded-xl font-semibold text-sm text-white overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)' }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute inset-0 shadow-lg shadow-purple-900/50" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Вхожу...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Войти
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Features */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { icon: <Shield className="w-4 h-4 text-purple-300" />, label: 'Защита' },
                { icon: <BarChart2 className="w-4 h-4 text-purple-300" />, label: 'Статистика' },
                { icon: <Key className="w-4 h-4 text-purple-300" />, label: 'API Keys' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <span className="text-[11px] text-zinc-500">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-zinc-500">
                {'Нет аккаунта? '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6">
          MellAC Anti-Cheat &copy; 2025 — Защита Minecraft серверов
        </p>
      </div>
    </main>
  );
}
