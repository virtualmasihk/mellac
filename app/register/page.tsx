'use client';

import { useState } from 'react';
// router not needed — auth-context handles redirect
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, Shield, AlertCircle, Check, Key, Server, BarChart2 } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const passwordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordStrong = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
    if (password.length < 6) { setError('Пароль должен быть минимум 6 символов'); return; }
    setIsLoading(true);
    const result = await register(username, email, password);
    if (result.error) setError(result.error);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#05050f] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background glow orbs */}
      <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-indigo-800/15 rounded-full blur-[90px] pointer-events-none" />

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
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

          <div className="p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white mb-1">Создать аккаунт</h1>
              <p className="text-sm text-zinc-400">Начните защищать ваш Minecraft сервер</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Имя пользователя</label>
                <input
                  type="text"
                  placeholder="Ваш никнейм (мин. 3 символа)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-all duration-200"
                />
              </div>

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
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Пароль</span>
                  {password.length > 0 && (
                    <span className={`text-[10px] font-normal ${passwordStrong ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {passwordStrong ? '✓ Надёжный' : 'Слишком короткий'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Минимум 6 символов"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Подтвердите пароль</span>
                  {confirmPassword.length > 0 && (
                    <span className={`text-[10px] font-normal flex items-center gap-1 ${passwordMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                      {passwordMatch ? <><Check className="w-3 h-3" />Совпадают</> : 'Не совпадают'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.06] border text-white placeholder-zinc-600 text-sm focus:outline-none transition-all duration-200 focus:bg-white/[0.08] ${
                      confirmPassword.length > 0
                        ? passwordMatch
                          ? 'border-emerald-500/40 focus:border-emerald-500/60'
                          : 'border-red-500/40 focus:border-red-500/60'
                        : 'border-white/[0.1] focus:border-purple-500/60'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Создаю аккаунт...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Зарегистрироваться
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* What you get */}
            <div className="mt-6 p-4 rounded-xl bg-purple-500/[0.07] border border-purple-500/20">
              <p className="text-xs text-purple-300 font-medium mb-3">После регистрации вы получите:</p>
              <div className="space-y-2">
                {[
                  { icon: <Key className="w-3.5 h-3.5 text-purple-300" />, text: 'Уникальный API ключ для плагина' },
                  { icon: <Server className="w-3.5 h-3.5 text-purple-300" />, text: 'Подключение неограниченных серверов' },
                  { icon: <BarChart2 className="w-3.5 h-3.5 text-purple-300" />, text: 'Реалтайм панель мониторинга' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-xs text-zinc-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-zinc-500">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Войти
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
