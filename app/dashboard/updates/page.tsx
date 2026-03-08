'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap } from 'lucide-react';

export default function UpdatesPage() {
  const updates = [
    {
      version: '2.1.0',
      date: '2025-03-07',
      type: 'Feature',
      title: 'Новая система детекции Speed Hack',
      description: 'Улучшенный алгоритм для обнаружения повышенной скорости движения',
    },
    {
      version: '2.0.5',
      date: '2025-03-05',
      type: 'Fix',
      title: 'Исправления критических ошибок',
      description: 'Исправлены проблемы с потерей данных при восстановлении сервера',
    },
    {
      version: '2.0.0',
      date: '2025-02-28',
      type: 'Major',
      title: 'Полный переход на новую архитектуру',
      description: '完全重新设计系统с улучшенной производительностью и масштабируемостью',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Обновления</h1>
        <p className="text-gray-400 mt-2">История обновлений и новых функций MellAC</p>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.version} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {update.type === 'Feature' && <Zap className="h-5 w-5 text-purple-400" />}
                {update.type === 'Fix' && <AlertCircle className="h-5 w-5 text-green-400" />}
                {update.type === 'Major' && <Zap className="h-5 w-5 text-yellow-400" />}
                <div>
                  <h3 className="text-lg font-bold text-white">{update.title}</h3>
                  <p className="text-sm text-gray-400">v{update.version} • {update.date}</p>
                </div>
              </div>
              <Badge className="bg-purple-600/20 text-purple-400 border-0">{update.type}</Badge>
            </div>
            <p className="text-gray-300">{update.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
