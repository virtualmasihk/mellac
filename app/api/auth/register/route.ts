import { NextRequest, NextResponse } from 'next/server';
import { ensureDbInitialized } from '@/lib/init-db-once';
import { getDb } from '@/lib/db';
import { isDbConfigured } from '@/lib/db-config';
import { hashPassword, generateApiKey, generateJWT } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'База данных не настроена. Перейдите в настройки.' }, { status: 503 });
  }

  try {
    await ensureDbInitialized();
    const db = await getDb();
    const body = await request.json();
    const { username, email, password } = schema.parse(body);

    const existing = await db.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Пользователь с таким именем или email уже существует' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const apiKey = generateApiKey();

    const result = await db.execute(
      'INSERT INTO users (username, email, password_hash, api_key, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, passwordHash, apiKey, 'user']
    );

    const userId = result.lastInsertRowid!;
    const token = generateJWT(userId, username);

    return NextResponse.json({ success: true, token, user: { id: userId, username, email, apiKey, role: 'user' } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    }
    console.error('[MellAC] Register error:', error);
    return NextResponse.json({ error: 'Ошибка при регистрации' }, { status: 500 });
  }
}
