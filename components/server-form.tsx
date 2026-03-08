'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { AlertCircle } from 'lucide-react';
import { z } from 'zod';

interface ServerFormProps {
  onSuccess?: () => void;
}

const serverSchema = z.object({
  server_name: z.string().min(1, 'Название сервера обязательно'),
  server_ip: z.string().min(1, 'IP адрес обязателен'),
  server_port: z.coerce.number().optional(),
});

export function ServerForm({ onSuccess }: ServerFormProps) {
  const [formData, setFormData] = useState({
    server_name: '',
    server_ip: '',
    server_port: 25565,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const validated = serverSchema.parse(formData);
      
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при создании сервера');
      }

      setFormData({ server_name: '', server_ip: '', server_port: 25565 });
      onSuccess?.();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Ошибка валидации');
      } else {
        setError(err instanceof Error ? err.message : 'Ошибка при создании сервера');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <FieldGroup>
        <FieldLabel>Название сервера</FieldLabel>
        <Input
          type="text"
          placeholder="Например: Survival Server"
          value={formData.server_name}
          onChange={(e) => setFormData({ ...formData, server_name: e.target.value })}
          required
          className="bg-black/20 backdrop-blur-md border-white/10 text-white"
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>IP адрес</FieldLabel>
        <Input
          type="text"
          placeholder="Например: 192.168.1.1 или example.com"
          value={formData.server_ip}
          onChange={(e) => setFormData({ ...formData, server_ip: e.target.value })}
          required
          className="bg-black/20 backdrop-blur-md border-white/10 text-white"
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>Порт (необязательно)</FieldLabel>
        <Input
          type="number"
          placeholder="25565"
          value={formData.server_port}
          onChange={(e) => setFormData({ ...formData, server_port: parseInt(e.target.value) })}
          className="bg-black/20 backdrop-blur-md border-white/10 text-white"
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? 'Создание...' : 'Добавить сервер'}
      </Button>
    </form>
  );
}
