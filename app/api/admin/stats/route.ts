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
  if (!isDbConfigured()) return NextResponse.json({ error: 'БД не настроена' }, { status: 503 });
  try {
    await ensureDbInitialized();
    const db = await getDb();

    const token = getToken(request);
    const payload = token ? verifyJWT(token) : null;
    if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const [usersRes, serversRes, cheatsRes, flaggedRes] = await Promise.all([
      db.execute('SELECT COUNT(*) as count FROM users'),
      db.execute('SELECT COUNT(*) as count FROM servers WHERE is_active = 1'),
      db.execute('SELECT COUNT(*) as count FROM cheat_logs'),
      db.execute('SELECT COUNT(*) as count FROM player_stats WHERE is_flagged = 1'),
    ]);

    const recentCheats = await db.execute(
      `SELECT cl.id, cl.player_name, cl.cheat_type, cl.severity, cl.detected_at,
              s.server_name, u.username as owner
       FROM cheat_logs cl
       JOIN servers s ON s.id = cl.server_id
       JOIN users u ON u.id = s.user_id
       ORDER BY cl.detected_at DESC LIMIT 20`
    );

    const allServers = await db.execute(
      `SELECT s.id, s.server_name, s.server_ip, s.server_port, s.is_active,
              s.last_seen, s.created_at, u.username as owner, u.email as owner_email,
              COUNT(cl.id) as total_detections
       FROM servers s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN cheat_logs cl ON cl.server_id = s.id
       GROUP BY s.id
       ORDER BY s.created_at DESC`
    );

    const allUsers = await db.execute(
      `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`
    );

    return NextResponse.json({
      stats: {
        totalUsers: usersRes.rows[0]?.count ?? 0,
        totalServers: serversRes.rows[0]?.count ?? 0,
        totalCheats: cheatsRes.rows[0]?.count ?? 0,
        flaggedPlayers: flaggedRes.rows[0]?.count ?? 0,
      },
      recentCheats: recentCheats.rows,
      allServers: allServers.rows,
      allUsers: allUsers.rows,
    });
  } catch (error) {
    console.error('[MellAC] Admin stats error:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  }
}
