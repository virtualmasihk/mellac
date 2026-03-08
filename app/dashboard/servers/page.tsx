'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ServerForm } from '@/components/server-form';
import { ServersList } from '@/components/servers-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ServersPage() {
  const [refresh, setRefresh] = useState(false);

  const handleServerCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Мои серверы</h1>
        <p className="text-gray-400 mt-2">Управляйте своими Minecraft серверами и отслеживайте активность</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-neutral-800 border-neutral-700">
          <TabsTrigger value="list" className="text-gray-300 data-[state=active]:text-white">
            Список серверов
          </TabsTrigger>
          <TabsTrigger value="create" className="text-gray-300 data-[state=active]:text-white">
            Добавить сервер
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ServersList refresh={refresh} />
        </TabsContent>

        <TabsContent value="create">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Добавить новый сервер</h2>
            <div className="max-w-md">
              <ServerForm onSuccess={handleServerCreated} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Setup Instructions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">Инструкция по установке</h2>
        <div className="space-y-3 text-gray-300">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-white">Создайте сервер</p>
              <p className="text-sm text-gray-400">Заполните форму выше и создайте сервер в системе</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-white">Скопируйте API ключ</p>
              <p className="text-sm text-gray-400">Используйте кнопку копирования рядом с API ключом</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-white">Скачайте и установите плагин</p>
              <p className="text-sm text-gray-400">Скачайте MellAC плагин и поместите его в папку plugins вашего сервера</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-semibold text-white">Настройте config.yml</p>
              <p className="text-sm text-gray-400">Найдите файл config.yml в папке plugins/MellAC и вставьте туда ваш API ключ</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              5
            </div>
            <div>
              <p className="font-semibold text-white">Перезагрузите сервер</p>
              <p className="text-sm text-gray-400">Команда /reload или перезагрузка сервера для активации плагина</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
