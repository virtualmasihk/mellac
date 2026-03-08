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
  if (!isDbConfigured()) return NextResponse.json({ totalCheats: 0, flaggedPlayers: 0, cheatsByType: [], cheatsBySeverity: [], topPlayers: [] });
  try {
    await ensureDbInitialized();
    const db = await getDb();

    const token = getToken(request);
    const payload = token ? verifyJWT(token) : null;
    if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('server_id');
    if (!serverId) return NextResponse.json({ error: 'server_id обязателен' }, { status: 400 });

    const srvRes = await db.execute('SELECT id FROM servers WHERE id = ? AND user_id = ?', [serverId, payload.userId]);
    if (srvRes.rows.length === 0) return NextResponse.json({ error: 'Сервер не найден' }, { status: 404 });

    const [totalRes, flaggedRes, byType, bySeverity, topPlayers] = await Promise.all([
      db.execute('SELECT COUNT(*) as count FROM cheat_logs WHERE server_id = ?', [serverId]),
      db.execute('SELECT COUNT(*) as count FROM player_stats WHERE server_id = ? AND is_flagged = 1', [serverId]),
      db.execute('SELECT cheat_type, COUNT(*) as count FROM cheat_logs WHERE server_id = ? GROUP BY cheat_type ORDER BY count DESC', [serverId]),
      db.execute('SELECT severity, COUNT(*) as count FROM cheat_logs WHERE server_id = ? GROUP BY severity', [serverId]),
      db.execute('SELECT player_name, player_ip, total_detections, last_detection FROM player_stats WHERE server_id = ? ORDER BY total_detections DESC LIMIT 10', [serverId]),
    ]);

    return NextResponse.json({
      totalCheats: totalRes.rows[0]?.count ?? 0,
      flaggedPlayers: flaggedRes.rows[0]?.count ?? 0,
      cheatsByType: byType.rows,
      cheatsBySeverity: bySeverity.rows,
      topPlayers: topPlayers.rows,
    });
  } catch (error) {
    console.error('[MellAC] Stats error:', error);
    return NextResponse.json({ error: 'Ошибка при получении статистики' }, { status: 500 });
  }
}
