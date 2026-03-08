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
  if (!isDbConfigured()) return NextResponse.json({ players: [] });
  try {
    await ensureDbInitialized();
    const db = await getDb();

    const token = getToken(request);
    const payload = token ? verifyJWT(token) : null;
    if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    // Get all flagged players from servers belonging to this user
    const result = await db.execute(
      `SELECT ps.player_name, ps.player_ip, ps.total_detections, ps.last_detection, s.server_name
       FROM player_stats ps
       JOIN servers s ON s.id = ps.server_id
       WHERE s.user_id = ? AND ps.is_flagged = 1
       ORDER BY ps.total_detections DESC
       LIMIT 200`,
      [payload.userId]
    );

    return NextResponse.json({ players: result.rows });
  } catch (error) {
    console.error('[MellAC] Cheaters error:', error);
    return NextResponse.json({ players: [] });
  }
}
