import { isDbConfigured } from './db-config';

let initialized = false;

export async function ensureDbInitialized(): Promise<void> {
  if (typeof window !== 'undefined') return;
  if (initialized) return;
  if (!isDbConfigured()) return;

  try {
    const { initializeDb } = await import('./db');
    await initializeDb();
    initialized = true;
  } catch (err) {
    initialized = false;
    throw err;
  }
}

export function resetInitFlag() {
  initialized = false;
}
