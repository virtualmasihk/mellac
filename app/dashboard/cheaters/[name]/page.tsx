'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, AlertTriangle, Server, Clock } from 'lucide-react';
import Link from 'next/link';

interface PlayerDetails {
  name: string;
  stats: any[];
  logs: any[];
  cheatTypes: any[];
  serverStats: any[];
}

export default function PlayerDetailsPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const playerName = params.name as string;
  
  const [player, setPlayer] = useState<PlayerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<'suspicious' | 'legit' | 'cheater'>('suspicious');

  useEffect(() => {
    if (!token || !playerName) return;
    
    fetch(`/api/player-details/${playerName}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.player) {
          setPlayer(d.player);
          // Автоматическая категоризация
          const totalDetections = d.player.stats.reduce((sum: number, s: any) => sum + Number(s.total_detections), 0);
          if (totalDetections >= 50) setCategory('cheater');
          else if (totalDetections >= 10) setCategory('suspicious');
          else setCategory('legit');
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [token, playerName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-500">Загрузка...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/cheaters">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </Link>
        <div className="text-center py-20">
          <p className="text-zinc-500">Игрок не найден</p>
        </div>
      </div>
    );
  }

  const totalDetections = player.stats.reduce((sum, s) => sum + Number(s.total_detections), 0);
  
  const categoryColors = {
    legit: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', label: 'Легитный' },
    suspicious: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Подозрительный' },
    cheater: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'Читер' },
  };

  const currentCategory = categoryColors[category];

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cheaters">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{player.name}</h1>
            <p className="text-zinc-500 text-sm">Детальная информация об игроке</p>
          </div>
        </div>
        
        {/* Category selector */}
        <div className="flex gap-2">
          {(['legit', 'suspicious', 'cheater'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                category === cat
                  ? `${categoryColors[cat].bg} ${categoryColors[cat].border} ${categoryColors[cat].text} border`
                  : 'bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08]'
              }`}
            >
              {categoryColors[cat].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Всего обнаружений</p>
              <p className="text-2xl font-bold text-white">{totalDetections}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-400" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Типов читов</p>
              <p className="text-2xl font-bold text-white">{player.cheatTypes.length}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Серверов</p>
              <p className="text-2xl font-bold text-white">{player.serverStats.length}</p>
            </div>
            <Server className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className={`p-5 ${currentCategory.bg} ${currentCategory.border} border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Категория</p>
              <p className={`text-xl font-bold ${currentCategory.text}`}>{currentCategory.label}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cheat types */}
        <Card className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-400" />
            Типы читов
          </h3>
          <div className="space-y-3">
            {player.cheatTypes.map((ct: any) => (
              <div key={ct.cheat_type} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{ct.cheat_type}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                  {ct.count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Server stats */}
        <Card className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-400" />
            По серверам
          </h3>
          <div className="space-y-3">
            {player.serverStats.map((ss: any) => (
              <div key={ss.server_name} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300 truncate">{ss.server_name}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold">
                  {ss.detections}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-400" />
            Последняя активность
          </h3>
          <div className="space-y-3">
            {player.stats.slice(0, 5).map((stat: any) => (
              <div key={stat.id} className="text-sm">
                <p className="text-zinc-300">{stat.server_name}</p>
                <p className="text-xs text-zinc-600">
                  {stat.last_detection ? new Date(stat.last_detection).toLocaleString('ru-RU') : 'Нет данных'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Logs table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold">История обнаружений</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Тип</th>
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Причина</th>
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Сервер</th>
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Серьёзность</th>
                <th className="text-left py-3 px-5 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Время</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {player.logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-5 text-white text-sm font-medium">{log.cheat_type}</td>
                  <td className="py-3 px-5 text-zinc-400 text-xs max-w-md truncate">{log.cheat_reason || '—'}</td>
                  <td className="py-3 px-5 text-zinc-500 text-sm">{log.server_name}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold border ${
                      log.severity === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                      log.severity === 'medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                      'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-zinc-500 text-sm">
                    {new Date(log.detected_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
