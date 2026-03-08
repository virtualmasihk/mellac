import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/init-db-once';
import { getDb } from '@/lib/db';
import { isDbConfigured } from '@/lib/db-config';
import { verifyJWT } from '@/lib/auth';

function getToken(req: NextRequest) {
  const h = req.headers.get('Authorization');
  return h?.startsWith('Bearer ') ? h.slice(7) : null;
}

export async function GET(request: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ logs: [], total: 0 });
  try {
    await ensureDbInitialized();
    const db = await getDb();

    const token = getToken(request);
    const payload = token ? verifyJWT(token) : null;
    if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('server_id');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!serverId) return NextResponse.json({ error: 'server_id обязателен' }, { status: 400 });

    const srvRes = await db.execute(
      'SELECT id FROM servers WHERE id = ? AND user_id = ?',
      [serverId, payload.userId]
    );
    if (srvRes.rows.length === 0) return NextResponse.json({ error: 'Сервер не найден' }, { status: 404 });

    const logs = await db.execute(
      `SELECT id, player_name, player_ip, cheat_type, cheat_reason, severity, detected_at
       FROM cheat_logs WHERE server_id = ? ORDER BY detected_at DESC LIMIT ? OFFSET ?`,
      [serverId, limit, offset]
    );
    const countRes = await db.execute(
      'SELECT COUNT(*) as count FROM cheat_logs WHERE server_id = ?',
      [serverId]
    );

    return NextResponse.json({
      logs: logs.rows,
      total: countRes.rows[0]?.count ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[MellAC] Logs error:', error);
    return NextResponse.json({ error: 'Ошибка при получении логов' }, { status: 500 });
  }
}
