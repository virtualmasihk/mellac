'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  apiKey: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('mellac_token');
    const savedUser = localStorage.getItem('mellac_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      // If DB not configured yet — try bootstrap superadmin login
      if (res.status === 503) {
        res = await fetch('/api/auth/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Ошибка входа' };

      localStorage.setItem('mellac_token', data.token);
      localStorage.setItem('mellac_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      if (data.user.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return {};
    } catch {
      return { error: 'Сетевая ошибка' };
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Ошибка регистрации' };

      localStorage.setItem('mellac_token', data.token);
      localStorage.setItem('mellac_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      router.push('/dashboard');
      return {};
    } catch {
      return { error: 'Сетевая ошибка' };
    }
  };

  const logout = () => {
    localStorage.removeItem('mellac_token');
    localStorage.removeItem('mellac_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
