'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Server, Activity } from 'lucide-react';

interface ServerRow {
  id: number;
  server_name: string;
  server_ip: string;
  server_port: number;
  is_active: number;
  last_seen: string | null;
  created_at: string;
  owner: string;
  owner_email: string;
  total_detections: number;
}

export default function AdminServersPage() {
  const { token } = useAuth();
  const [servers, setServers] = useState<ServerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.allServers) setServers(d.allServers); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Все серверы</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Список всех подключённых серверов</p>
      </div>

      <div className="rounded-xl bg-black/20 backdrop-blur-md border border-white/10 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Server className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-semibold text-white">Серверы ({servers.length})</span>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : servers.length === 0 ? (
          <p className="px-5 py-10 text-sm text-zinc-600 text-center">Нет серверов</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {['Сервер', 'IP : Порт', 'Владелец', 'Обнаружений', 'Последний онлайн', 'Статус'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {servers.map((srv) => (
                <tr key={srv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{srv.server_name}</td>
                  <td className="px-5 py-3 text-zinc-400 font-mono text-xs">{srv.server_ip}:{srv.server_port}</td>
                  <td className="px-5 py-3">
                    <p className="text-zinc-300">{srv.owner}</p>
                    <p className="text-[11px] text-zinc-600">{srv.owner_email}</p>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{Number(srv.total_detections)}</td>
                  <td className="px-5 py-3 text-zinc-500 text-xs">
                    {srv.last_seen ? new Date(srv.last_seen).toLocaleString('ru') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${
                      srv.is_active
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                    }`}>
                      <Activity className="w-3 h-3" />
                      {srv.is_active ? 'Активен' : 'Неактивен'}
                    </span>
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
