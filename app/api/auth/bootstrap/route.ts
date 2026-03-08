/**
 * Bootstrap login — allows superadmin to log in even before the DB is configured.
 * Credentials are checked against env vars (or hardcoded defaults).
 * Returns a JWT with role=superadmin so the admin can open /admin/database.
 */
import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { generateJWT } from '@/lib/auth';
import { z } from 'zod';

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'holachaneal@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'hola';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = schema.parse(body);

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    // Plain-text compare for bootstrap (password stored in env, not hashed)
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    const token = generateJWT(0, 'admin', 'superadmin');
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: 0,
        username: 'admin',
        email: ADMIN_EMAIL,
        apiKey: '',
        role: 'superadmin',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
