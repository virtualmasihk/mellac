'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Database, CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react';

type DbType = 'none' | 'sqlite' | 'mysql' | 'postgresql';

interface DbConfig {
  type: DbType;
  filePath?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

const DB_OPTIONS: { value: DbType; label: string; desc: string }[] = [
  { value: 'none',       label: 'Отключена',  desc: 'БД не используется' },
  { value: 'sqlite',     label: 'SQLite',      desc: 'Локальный файл, без сервера' },
  { value: 'mysql',      label: 'MySQL',       desc: 'MySQL / MariaDB сервер' },
  { value: 'postgresql', label: 'PostgreSQL',  desc: 'PostgreSQL сервер' },
];

export default function AdminDatabasePage() {
  const { token } = useAuth();
  const [config, setConfig] = useState<DbConfig>({ type: 'none' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/db-config', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.config) setConfig({ ...d.config, password: '' }); })
      .catch(() => {});
  }, [token]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/db-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      setMessage({ text: data.message ?? data.error, ok: res.ok });
    } catch {
      setMessage({ text: 'Сетевая ошибка', ok: false });
    }
    setIsSaving(false);
  };

  const showRemote = config.type === 'mysql' || config.type === 'postgresql';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">База данных</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Настройте подключение к базе данных</p>
      </div>

      <div className="rounded-xl bg-black/20 backdrop-blur-md border border-white/10 p-6 space-y-6">
        {/* DB Type selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Тип базы данных</label>
          <div className="grid grid-cols-2 gap-2">
            {DB_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((c) => ({ ...c, type: opt.value }))}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  config.type === opt.value
                    ? 'bg-purple-600/20 border-purple-500/40 text-white'
                    : 'bg-white/[0.03] border-white/[0.07] text-zinc-400 hover:border-white/[0.15] hover:text-zinc-300'
                }`}
              >
                <Database className={`w-4 h-4 mt-0.5 shrink-0 ${config.type === opt.value ? 'text-purple-300' : 'text-zinc-500'}`} />
                <div>
                  <p className="text-sm font-medium leading-none">{opt.label}</p>
                  <p className="text-[11px] mt-1 text-zinc-500">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SQLite path */}
        {config.type === 'sqlite' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Путь к файлу</label>
            <input
              type="text"
              placeholder="data/mellac.db (по умолчанию)"
              value={config.filePath ?? ''}
              onChange={(e) => setConfig((c) => ({ ...c, filePath: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <p className="text-[11px] text-zinc-600">Оставьте пустым для использования пути по умолчанию</p>
          </div>
        )}

        {/* Remote DB fields */}
        {showRemote && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Хост</label>
                <input
                  type="text"
                  placeholder="127.0.0.1"
                  value={config.host ?? ''}
                  onChange={(e) => setConfig((c) => ({ ...c, host: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Порт</label>
                <input
                  type="number"
                  placeholder={config.type === 'mysql' ? '3306' : '5432'}
                  value={config.port ?? ''}
                  onChange={(e) => setConfig((c) => ({ ...c, port: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">База данных</label>
              <input
                type="text"
                placeholder="mellac"
                value={config.database ?? ''}
                onChange={(e) => setConfig((c) => ({ ...c, database: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Пользователь</label>
                <input
                  type="text"
                  placeholder={config.type === 'mysql' ? 'root' : 'postgres'}
                  value={config.username ?? ''}
                  onChange={(e) => setConfig((c) => ({ ...c, username: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Пароль</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={config.password ?? ''}
                  onChange={(e) => setConfig((c) => ({ ...c, password: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-sm ${
            message.ok
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.ok
              ? <CheckCircle className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Сохраняю...' : 'Сохранить и подключить'}
        </button>
      </div>

      {/* Info box */}
      <div className="rounded-xl bg-blue-500/[0.06] border border-blue-500/20 p-4">
        <p className="text-sm text-blue-300 font-medium mb-2">Как это работает</p>
        <ul className="text-xs text-zinc-400 space-y-1">
          <li>• При сохранении конфигурации система автоматически создаёт таблицы</li>
          <li>• Аккаунт superadmin holachaneal@gmail.com создаётся автоматически при первой инициализации</li>
          <li>• SQLite — идеально для разработки, MySQL/PostgreSQL — для production</li>
        </ul>
      </div>
    </div>
  );
}
