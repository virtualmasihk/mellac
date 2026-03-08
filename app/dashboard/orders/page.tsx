'use client';

import { Card } from '@/components/ui/card';
import { Empty } from '@/components/ui/empty';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Заказы</h1>
        <p className="text-gray-400 mt-2">История ваших покупок и лицензий</p>
      </div>

      <Card>
        <Empty
          icon="shopping-cart"
          title="Нет активных заказов"
          description="Когда вы сделаете заказ лицензии, он будет отображаться здесь"
          className="py-12"
        />
      </Card>
    </div>
  );
}
