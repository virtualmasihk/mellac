'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Бесплатный',
      price: '₽0',
      description: 'Для небольших серверов',
      features: [
        'До 1 сервера',
        'Базовый мониторинг',
        'Хранение логов 7 дней',
        'Поддержка по email',
      ],
    },
    {
      name: 'Pro',
      price: '₽499',
      period: '/месяц',
      description: 'Для растущих сообществ',
      highlighted: true,
      features: [
        'До 10 серверов',
        'Продвинутый мониторинг',
        'Хранение логов 90 дней',
        'Приоритетная поддержка',
        'API доступ',
      ],
    },
    {
      name: 'Enterprise',
      price: 'По запросу',
      description: 'Для крупных сетей',
      features: [
        'Неограниченные серверы',
        'Полный контроль',
        'Хранение логов неограниченное',
        ' 24/7 поддержка',
        'Выделенный менеджер',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Тарифные планы</h1>
        <p className="text-gray-400 mt-2">Выберите подходящий план для ваших нужд</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`border p-6 transition-all ${
              plan.highlighted
                ? 'bg-purple-600/10 border-purple-500/50 ring-2 ring-purple-500/50'
                : 'border-white/10'
            }`}
          >
            {plan.highlighted && (
              <div className="mb-4 inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-semibold rounded-full">
                Популярный
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              {plan.period && <span className="text-gray-400">{plan.period}</span>}
            </div>

            <Button
              className={`w-full mb-6 ${
                plan.highlighted
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-neutral-800 hover:bg-neutral-700'
              }`}
            >
              {plan.name === 'Enterprise' ? 'Связаться' : 'Выбрать'}
            </Button>

            <div className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
