import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export type DbType = 'sqlite' | 'mysql' | 'postgresql' | 'none';

export interface DbConfig {
  type: DbType;
  // SQLite
  filePath?: string;
  // MySQL / PostgreSQL
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

const CONFIG_PATH = path.join(process.cwd(), 'data', 'db-config.json');
// Default: SQLite in-process (no external DB needed for quick start)
const DEFAULT_CONFIG: DbConfig = {
  type: 'sqlite',
  filePath: path.join(process.cwd(), 'data', 'mellac.db'),
};

export function getDbConfig(): DbConfig {
  try {
    if (existsSync(CONFIG_PATH)) {
      const raw = readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(raw) as DbConfig;
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONFIG;
}

export function saveDbConfig(config: DbConfig): void {
  const dir = path.dirname(CONFIG_PATH);
  try {
    const { mkdirSync } = require('fs');
    mkdirSync(dir, { recursive: true });
  } catch {}
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export function isDbConfigured(): boolean {
  const cfg = getDbConfig();
  return cfg.type !== 'none';
}
