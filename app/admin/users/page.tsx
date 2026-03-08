'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Users } from 'lucide-react';

interface UserRow {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const roleBadge: Record<string, string> = {
  superadmin: 'bg-red-500/10 border-red-500/20 text-red-400',
  user: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
};

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.allUsers) setUsers(d.allUsers); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Пользователи</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Все зарегистрированные аккаунты</p>
      </div>

      <div className="rounded-xl bg-black/20 backdrop-blur-md border border-white/10 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Users className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-semibold text-white">Аккаунты ({users.length})</span>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="px-5 py-10 text-sm text-zinc-600 text-center">Нет пользователей</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {['ID', 'Пользователь', 'Email', 'Роль', 'Зарегистрирован'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-zinc-600 font-mono text-xs">#{u.id}</td>
                  <td className="px-5 py-3 text-white font-medium">{u.username}</td>
                  <td className="px-5 py-3 text-zinc-400">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${roleBadge[u.role] ?? roleBadge.user}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString('ru')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
