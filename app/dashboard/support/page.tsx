'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { MessageSquare, Mail, Send } from 'lucide-react';
import { useState } from 'react';

export default function SupportPage() {
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: 'Как часто обновляется плагин?',
      answer: 'Мы выпускаем обновления примерно раз в неделю с новыми функциями и исправлениями',
    },
    {
      question: 'Какие версии Minecraft поддерживаются?',
      answer: '1.16.5 и выше. Самые свежие версии получают приоритет в поддержке',
    },
    {
      question: 'Как связаться с технической поддержкой?',
      answer: 'Используйте форму на этой странице или отправьте email на support@mellac.ru',
    },
    {
      question: 'Бесплатна ли система?',
      answer: 'Да! Базовые функции полностью бесплатны. Есть платные планы с дополнительными возможностями',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Поддержка</h1>
        <p className="text-gray-400 mt-2">Нам нужна помощь или у вас есть вопрос? Мы здесь, чтобы помочь</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Cards */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Чат</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Свяжитесь с нами через Discord сообщество</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Присоединиться к Discord
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Email</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Отправьте нам сообщение на email</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            support@mellac.ru
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Send className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Форма</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Используйте форму ниже для быстрого ответа</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Заполнить форму
          </Button>
        </Card>
      </div>

      {/* FAQ */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-neutral-800 pb-4 last:border-b-0">
              <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Support Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Отправить сообщение</h2>
        <form className="space-y-4">
          <FieldGroup>
            <FieldLabel>Тема</FieldLabel>
            <Input placeholder="О чём ваше сообщение?" className="bg-black/20 backdrop-blur-md border-white/10 text-white" />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Сообщение</FieldLabel>
            <textarea
              placeholder="Опишите вашу проблему или вопрос..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 min-h-32 resize-none"
            />
          </FieldGroup>

          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Отправить сообщение
          </Button>
        </form>
      </Card>
    </div>
  );
}
