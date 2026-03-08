import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/init-db-once';
import { getDb } from '@/lib/db';
import { isDbConfigured } from '@/lib/db-config';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'БД не настроена' }, { status: 503 });
  }

  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }

    await ensureDbInitialized();
    const db = await getDb();
    const playerName = params.name;

    // Получить статистику игрока
    const statsRes = await db.execute(
      `SELECT ps.*, s.server_name, s.server_ip 
       FROM player_stats ps 
       JOIN servers s ON ps.server_id = s.id 
       WHERE ps.player_name = ?
       ORDER BY ps.total_detections DESC`,
      [playerName]
    );

    // Получить все логи читов
    const logsRes = await db.execute(
      `SELECT cl.*, s.server_name 
       FROM cheat_logs cl 
       JOIN servers s ON cl.server_id = s.id 
       WHERE cl.player_name = ? 
       ORDER BY cl.detected_at DESC 
       LIMIT 100`,
      [playerName]
    );

    // Подсчитать статистику по типам читов
    const cheatTypesRes = await db.execute(
      `SELECT cheat_type, COUNT(*) as count, MAX(detected_at) as last_seen
       FROM cheat_logs 
       WHERE player_name = ? 
       GROUP BY cheat_type 
       ORDER BY count DESC`,
      [playerName]
    );

    // Подсчитать статистику по серверам
    const serverStatsRes = await db.execute(
      `SELECT s.server_name, COUNT(*) as detections
       FROM cheat_logs cl
       JOIN servers s ON cl.server_id = s.id
       WHERE cl.player_name = ?
       GROUP BY s.server_name
       ORDER BY detections DESC`,
      [playerName]
    );

    return NextResponse.json({
      player: {
        name: playerName,
        stats: statsRes.rows,
        logs: logsRes.rows,
        cheatTypes: cheatTypesRes.rows,
        serverStats: serverStatsRes.rows,
      },
    });
  } catch (error) {
    console.error('[MellAC] Player details error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
