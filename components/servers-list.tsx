'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Copy, Server, Check, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';

interface ServerItem {
  id: number;
  server_name: string;
  server_ip: string;
  server_port: number;
  api_key: string;
  is_active: number;
  created_at: string;
}

interface ServersListProps {
  refresh?: boolean;
}

export function ServersList({ refresh }: ServersListProps) {
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string>('');
  const { token } = useAuth();

  const fetchServers = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const r = await fetch('/api/servers', { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) {
        const d = await r.json();
        setServers(d.servers || []);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { fetchServers(); }, [token, refresh]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-md py-16 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <Server className="h-5 w-5 text-zinc-600" />
        </div>
        <p className="text-zinc-500 text-sm">Нет серверов</p>
        <p className="text-zinc-600 text-xs">Создайте сервер на вкладке выше</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {servers.map((s) => (
        <div
          key={s.id}
          className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-md hover:border-white/20 transition-colors overflow-hidden"
        >
          <div className="p-5 flex items-start justify-between gap-4">
            {/* Left */}
            <div className="flex-1 min-w-0">
              {/* Name + status */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0">
                  <Server className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{s.server_name}</h3>
                  <p className="text-zinc-500 text-xs font-mono">{s.server_ip}:{s.server_port}</p>
                </div>
                {s.is_active ? (
                  <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    <Wifi className="h-3 w-3" /> Активен
                  </span>
                ) : (
                  <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-zinc-500 text-xs">
                    <WifiOff className="h-3 w-3" /> Неактивен
                  </span>
                )}
              </div>

              {/* API key row */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider w-16 flex-shrink-0">API Key</span>
                <code className="text-xs text-zinc-400 font-mono flex-1 truncate">{s.api_key}</code>
                <button
                  onClick={() => copy(s.api_key, s.api_key)}
                  className="p-1 hover:bg-white/[0.06] rounded transition-colors flex-shrink-0"
                  title="Копировать"
                >
                  {copiedKey === s.api_key
                    ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                    : <Copy className="h-3.5 w-3.5 text-zinc-500" />}
                </button>
              </div>

              <p className="text-[11px] text-zinc-600 mt-2">
                Создан {new Date(s.created_at).toLocaleDateString('ru-RU')}
              </p>
            </div>

            {/* Right */}
            <Link href={`/dashboard/servers/${s.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="border border-white/[0.08] hover:bg-white/[0.06] text-zinc-400 hover:text-white h-8 px-3 gap-1.5 text-xs"
              >
                Открыть
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
