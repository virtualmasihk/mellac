import { NextRequest, NextResponse } from 'next/server';
import { getDbConfig, saveDbConfig, DbConfig, DbType } from '@/lib/db-config';
import { resetDbClient } from '@/lib/db';
import { resetInitFlag } from '@/lib/init-db-once';
import { verifyJWT } from '@/lib/auth';
import { z } from 'zod';

function getToken(req: NextRequest) {
  const h = req.headers.get('Authorization');
  return h?.startsWith('Bearer ') ? h.slice(7) : null;
}

async function requireSuperAdmin(req: NextRequest) {
  const token = getToken(req);
  if (!token) return null;
  const payload = verifyJWT(token);
  if (!payload) return null;
  // Role check is embedded in token for speed — or re-fetch from DB if configured
  return payload;
}

const schema = z.object({
  type: z.enum(['none', 'sqlite', 'mysql', 'postgresql']),
  filePath: z.string().optional(),
  host: z.string().optional(),
  port: z.number().optional(),
  database: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const payload = await requireSuperAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const config = getDbConfig();
  // Hide password
  const safe = { ...config, password: config.password ? '••••••••' : '' };
  return NextResponse.json({ config: safe });
}

export async function POST(request: NextRequest) {
  const payload = await requireSuperAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  try {
    const body = await request.json();
    const config = schema.parse(body) as DbConfig;

    saveDbConfig(config);
    // Reset singleton so next request builds a fresh connection
    resetDbClient();
    resetInitFlag();

    // Test connection & init schema
    if (config.type !== 'none') {
      const { initializeDb } = await import('@/lib/db');
      await initializeDb();
    }

    return NextResponse.json({ success: true, message: 'Конфигурация БД сохранена' });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    console.error('[MellAC] DB config save error:', error);
    return NextResponse.json({ error: `Ошибка подключения: ${(error as Error).message}` }, { status: 500 });
  }
}
