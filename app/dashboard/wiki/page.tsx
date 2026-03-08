'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';

export default function WikiPage() {
  const [search, setSearch] = useState('');

  const articles = [
    {
      title: 'Как установить плагин',
      category: 'Начало работы',
      description: 'Пошаговая инструкция по установке MellAC на ваш Minecraft сервер',
    },
    {
      title: 'Конфигурация config.yml',
      category: 'Конфигурация',
      description: 'Полное описание всех параметров конфигурации плагина',
    },
    {
      title: 'Типы обнаруженных читов',
      category: 'Справка',
      description: 'Описание всех типов читов, которые может обнаружить система',
    },
    {
      title: 'API документация',
      category: 'Разработка',
      description: 'Интеграция с внешними сервисами через API',
    },
    {
      title: 'Командный список',
      category: 'Справка',
      description: 'Все доступные команды для администраторов серверов',
    },
    {
      title: 'Решение проблем',
      category: 'Помощь',
      description: 'Ответы на часто задаваемые вопросы и решение распространённых проблем',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Вики</h1>
        <p className="text-gray-400 mt-2">Документация и справочная информация</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Поиск статей..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <div
              key={article.title}
              className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-purple-400 mt-1">{article.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">{article.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
