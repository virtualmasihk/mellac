'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface CheatLog {
  id: number;
  player_name: string;
  player_ip: string;
  cheat_type: string;
  cheat_reason: string;
  severity: string;
  detected_at: string;
}

interface Stats {
  totalCheats: number;
  flaggedPlayers: number;
  cheatsByType: Array<{ cheat_type: string; count: number }>;
  cheatsBySeverity: Array<{ severity: string; count: number }>;
  topPlayers: Array<{
    player_name: string;
    player_ip: string;
    total_detections: number;
    last_detection: string;
  }>;
}

export default function ServerDetailPage() {
  const params = useParams();
  const serverId = params.id as string;
  const { token } = useAuth();
  const [logs, setLogs] = useState<CheatLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, statsRes] = await Promise.all([
          fetch(`/api/logs?server_id=${serverId}&limit=50`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`/api/stats?server_id=${serverId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data.logs);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [serverId, token]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Статистика сервера</h1>
        <p className="text-gray-400 mt-2">Мониторинг активности и обнаруженных нарушений</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Всего обнаружено</p>
                <p className="text-3xl font-bold text-white">{stats.totalCheats}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Игроков в черном списке</p>
                <p className="text-3xl font-bold text-white">{stats.flaggedPlayers}</p>
              </div>
              <Users className="h-10 w-10 text-orange-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Типов читов</p>
                <p className="text-3xl font-bold text-white">{stats.cheatsByType.length}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-400" />
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cheat Types */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Типы читов</h3>
          <div className="space-y-3">
            {stats?.cheatsByType.map((item) => (
              <div key={item.cheat_type} className="flex items-center justify-between">
                <span className="text-gray-300">{item.cheat_type}</span>
                <span className="font-bold text-white">{item.count}</span>
              </div>
            ))}
            {stats?.cheatsByType.length === 0 && (
              <p className="text-gray-400 text-sm">Нет данных</p>
            )}
          </div>
        </Card>

        {/* Top Players */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Топ игроков по обнаружениям</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-neutral-800">
                  <th className="text-left py-2 px-2">Имя игрока</th>
                  <th className="text-left py-2 px-2">IP</th>
                  <th className="text-right py-2 px-2">Обнаружений</th>
                </tr>
              </thead>
              <tbody>
                {stats?.topPlayers.map((player) => (
                  <tr key={player.player_name} className="border-b border-neutral-800 hover:bg-neutral-800">
                    <td className="py-3 px-2 text-white">{player.player_name}</td>
                    <td className="py-3 px-2 text-gray-400 font-mono text-sm">{player.player_ip}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm font-semibold">
                        {player.total_detections}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats?.topPlayers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">
                      Нет данных
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Последние обнаружения</h3>
        {isLoading ? (
          <p className="text-gray-400">Загрузка...</p>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-neutral-800">
                  <th className="text-left py-2 px-2">Имя игрока</th>
                  <th className="text-left py-2 px-2">IP</th>
                  <th className="text-left py-2 px-2">Тип читов</th>
                  <th className="text-left py-2 px-2">Причина</th>
                  <th className="text-left py-2 px-2">Серьёзность</th>
                  <th className="text-left py-2 px-2">Время</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors">
                    <td className="py-3 px-2 text-white">{log.player_name}</td>
                    <td className="py-3 px-2 text-gray-400 font-mono">{log.player_ip}</td>
                    <td className="py-3 px-2 text-gray-300">{log.cheat_type}</td>
                    <td className="py-3 px-2 text-gray-400 max-w-xs truncate">{log.cheat_reason}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(log.severity)}`}>
                        {log.severity === 'high' ? 'Высокая' : log.severity === 'medium' ? 'Средняя' : 'Низкая'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-400 text-xs">
                      {new Date(log.detected_at).toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">Нет обнаруженных нарушений</p>
        )}
      </Card>
    </div>
  );
}
