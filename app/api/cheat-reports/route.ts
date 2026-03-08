import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/init-db-once';
import { getDb } from '@/lib/db';
import { isDbConfigured } from '@/lib/db-config';
import { z } from 'zod';

const reportSchema = z.object({
  api_key: z.string(),
  player_name: z.string(),
  player_ip: z.string().optional(),
  cheat_type: z.string(),
  cheat_reason: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

export async function POST(request: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ error: 'БД не настроена' }, { status: 503 });
  try {
    await ensureDbInitialized();
    const db = await getDb();
    const body = await request.json();
    const data = reportSchema.parse(body);

    const serverRes = await db.execute(
      'SELECT id FROM servers WHERE api_key = ? AND is_active = 1',
      [data.api_key]
    );
    if (serverRes.rows.length === 0) {
      return NextResponse.json({ error: 'Неверный API ключ сервера' }, { status: 403 });
    }
    const serverId = serverRes.rows[0].id;

    await db.execute(
      'INSERT INTO cheat_logs (server_id, player_name, player_ip, cheat_type, cheat_reason, severity) VALUES (?, ?, ?, ?, ?, ?)',
      [serverId, data.player_name, data.player_ip ?? null, data.cheat_type, data.cheat_reason ?? null, data.severity ?? 'medium']
    );

    const statsRes = await db.execute(
      'SELECT id, total_detections FROM player_stats WHERE server_id = ? AND player_name = ?',
      [serverId, data.player_name]
    );
    if (statsRes.rows.length > 0) {
      const row = statsRes.rows[0];
      await db.execute(
        'UPDATE player_stats SET total_detections = ?, last_detection = CURRENT_TIMESTAMP, player_ip = ?, is_flagged = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [(row.total_detections as number) + 1, data.player_ip ?? null, row.id]
      );
    } else {
      await db.execute(
        'INSERT INTO player_stats (server_id, player_name, player_ip, total_detections, last_detection, is_flagged) VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, 1)',
        [serverId, data.player_name, data.player_ip ?? null]
      );
    }

    await db.execute('UPDATE servers SET last_seen = CURRENT_TIMESTAMP WHERE id = ?', [serverId]);

    return NextResponse.json({ success: true, message: 'Отчёт принят' });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    console.error('[MellAC] Cheat report error:', error);
    return NextResponse.json({ error: 'Ошибка при обработке отчёта' }, { status: 500 });
  }
}
