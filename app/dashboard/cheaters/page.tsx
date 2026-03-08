'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Search, Shield, AlertTriangle } from 'lucide-react';

interface FlaggedPlayer {
  player_name: string;
  player_ip: string | null;
  total_detections: number;
  last_detection: string | null;
  server_name?: string;
}

export default function CheatersPage() {
  const { token } = useAuth();
  const [players, setPlayers] = useState<FlaggedPlayer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/cheaters', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : { players: [] })
      .then((d) => { setPlayers(d.players || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [token]);

  const filtered = players.filter((p) =>
    p.player_name.toLowerCase().includes(search.toLowerCase())
  );

  const severityColor = (n: number) => {
    if (n >= 20) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (n >= 10) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  };

  return (
    <div className="space-y-6 max-w-[900px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">База читеров</h1>
        <p className="text-zinc-500 text-sm mt-1">Игроки с зафиксированными нарушениями на ваших серверах</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
        <input
          type="text"
          placeholder="Поиск по никнейму..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-md overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-zinc-600 text-sm">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
              <Shield className="h-5 w-5 text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-sm">
              {search ? 'Ничего не найдено' : 'Нарушителей не обнаружено'}
            </p>
            {!search && (
              <p className="text-zinc-600 text-xs max-w-xs text-center">
                Данные появятся здесь после того как плагин начнёт отправлять отчёты
              </p>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Игрок</th>
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">IP адрес</th>
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Обнаружений</th>
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Последний раз</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((p, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/dashboard/cheaters/${p.player_name}`}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
                      </div>
                      <span className="text-white text-sm font-medium hover:text-purple-400 transition-colors">{p.player_name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-500 text-sm font-mono">{p.player_ip || '—'}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${severityColor(p.total_detections)}`}>
                      {p.total_detections}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-500 text-sm">
                    {p.last_detection
                      ? new Date(p.last_detection).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
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
