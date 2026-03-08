'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Users, Server, AlertTriangle, Shield, Clock, TrendingUp } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalServers: number;
  totalCheats: number;
  flaggedPlayers: number;
}

interface CheatLog {
  id: number;
  player_name: string;
  cheat_type: string;
  severity: string;
  detected_at: string;
  server_name: string;
  owner: string;
}

interface ServerRow {
  id: number;
  server_name: string;
  server_ip: string;
  is_active: number;
  last_seen: string | null;
  owner: string;
  total_detections: number;
}

const severityColor: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentCheats, setRecentCheats] = useState<CheatLog[]>([]);
  const [servers, setServers] = useState<ServerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbNotConfigured, setDbNotConfigured] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 503) { setDbNotConfigured(true); setIsLoading(false); return; }
        if (!res.ok) { setIsLoading(false); return; }
        const data = await res.json();
        setStats(data.stats);
        setRecentCheats(data.recentCheats);
        setServers(data.allServers);
      } catch {}
      setIsLoading(false);
    })();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (dbNotConfigured) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">База данных не настроена</p>
          <p className="text-sm text-zinc-500 mb-4">Перейдите в раздел «База данных» для настройки подключения</p>
          <a
            href="/admin/database"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-600/30 transition-all"
          >
            Настроить базу данных
          </a>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Пользователей', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Серверов онлайн', value: stats?.totalServers ?? 0, icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Читов обнаружено', value: stats?.totalCheats ?? 0, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { label: 'Флаг. игроков', value: stats?.flaggedPlayers ?? 0, icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Панель управления</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Общая статистика системы MellAC</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl bg-black/20 backdrop-blur-md border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{Number(card.value).toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent cheats */}
        <div className="rounded-xl bg-black/20 backdrop-blur-md border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
            <Clock className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">Последние обнаружения</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentCheats.length === 0 ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">Нет данных</p>
            ) : (
              recentCheats.slice(0, 8).map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${severityColor[log.severity] ?? severityColor.medium}`}>
                    {log.severity.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{log.player_name}</p>
                    <p className="text-[11px] text-zinc-500">{log.cheat_type} · {log.server_name}</p>
                  </div>
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    {new Date(log.detected_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All servers */}
        <div className="rounded-xl bg-black/20 backdrop-blur-md border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
            <TrendingUp className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">Подключённые серверы</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {servers.length === 0 ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">Нет серверов</p>
            ) : (
              servers.slice(0, 8).map((srv) => (
                <div key={srv.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${srv.is_active ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{srv.server_name}</p>
                    <p className="text-[11px] text-zinc-500">{srv.server_ip} · {srv.owner}</p>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">{Number(srv.total_detections)} детект.</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
