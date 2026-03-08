import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-12345';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return compare(password, hashed);
}

export function generateApiKey(): string {
  return `mellac_${randomBytes(32).toString('hex')}`;
}

export function generateJWT(userId: number, username: string, role = 'user'): string {
  return jwt.sign(
    { userId, username, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyJWT(token: string): { userId: number; username: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; username: string; role: string };
  } catch {
    return null;
  }
}

// Alias для совместимости
export const verifyToken = verifyJWT;

export function generateServerApiKey(): string {
  return `srv_${randomBytes(24).toString('hex')}`;
}
