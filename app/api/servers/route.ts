import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/init-db-once';
import { getDb } from '@/lib/db';
import { isDbConfigured } from '@/lib/db-config';
import { verifyJWT, generateServerApiKey } from '@/lib/auth';
import { z } from 'zod';

function getToken(req: NextRequest) {
  const h = req.headers.get('Authorization');
  return h?.startsWith('Bearer ') ? h.slice(7) : null;
}

const createSchema = z.object({
  server_name: z.string().min(1),
  server_ip: z.string().min(1),
  server_port: z.number().optional(),
});

export async function POST(request: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ error: 'БД не настроена' }, { status: 503 });
  try {
    await ensureDbInitialized();
    const db = await getDb();

    const token = getToken(request);
    const payload = token ? verifyJWT(token) : null;
    if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const body = await request.json();
    const { server_name, server_ip, server_port } = createSchema.parse(body);
    const apiKey = generateServerApiKey();

    const result = await db.execute(
      'INSERT INTO servers (user_id, server_name, server_ip, server_port, api_key) VALUES (?, ?, ?, ?, ?)',
      [payload.userId, server_name, server_ip, server_port ?? 25565, apiKey]
    );

    return NextResponse.json({
      success: true,
      server: { id: result.lastInsertRowid, server_name, server_ip, server_port, api_key: apiKey },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    console.error('[MellAC] Create server error:', error);
    return NextResponse.json({ error: 'Ошибка при создании сервера' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ servers: [] });
  try {
    await ensureDbInitialized();
    const db = await getDb();

    const token = getToken(request);
    const payload = token ? verifyJWT(token) : null;
    if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const result = await db.execute(
      'SELECT id, server_name, server_ip, server_port, api_key, last_seen, is_active, created_at FROM servers WHERE user_id = ? ORDER BY created_at DESC',
      [payload.userId]
    );

    return NextResponse.json({ servers: result.rows });
  } catch (error) {
    console.error('[MellAC] Get servers error:', error);
    return NextResponse.json({ error: 'Ошибка при получении серверов' }, { status: 500 });
  }
}
