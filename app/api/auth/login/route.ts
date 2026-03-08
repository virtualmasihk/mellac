import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/init-db-once';
import { getDb } from '@/lib/db';
import { isDbConfigured } from '@/lib/db-config';
import { verifyPassword, generateJWT } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });
  }
  try {
    await ensureDbInitialized();
    const db = await getDb();
    const body = await request.json();
    const { email, password } = schema.parse(body);

    const result = await db.execute(
      'SELECT id, username, email, password_hash, api_key, role FROM users WHERE email = ?',
      [email]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password_hash as string);
    if (!valid) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    const token = generateJWT(user.id as number, user.username as string, user.role as string);
    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email, apiKey: user.api_key, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    }
    console.error('[MellAC] Login error:', error);
    return NextResponse.json({ error: 'Ошибка при входе' }, { status: 500 });
  }
}
