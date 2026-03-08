import path from 'path';
import { mkdirSync } from 'fs';
import { getDbConfig, DbConfig } from './db-config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Row {
  [key: string]: unknown;
}

export interface DbClient {
  execute(sql: string, args?: unknown[]): Promise<{ rows: Row[]; rowsAffected?: number; lastInsertRowid?: number }>;
  close(): Promise<void>;
}

// ─── Clients ─────────────────────────────────────────────────────────────────

async function buildSqliteClient(cfg: DbConfig): Promise<DbClient> {
  const { createClient } = await import('@libsql/client');
  const filePath = cfg.filePath || path.join(process.cwd(), 'data', 'mellac.db');
  const dir = path.dirname(filePath);
  try { mkdirSync(dir, { recursive: true }); } catch {}

  const client = createClient({ url: `file:${filePath}` });

  return {
    async execute(sql, args = []) {
      const res = await client.execute({ sql, args });
      return {
        rows: res.rows as Row[],
        rowsAffected: res.rowsAffected,
        lastInsertRowid: res.lastInsertRowid ? Number(res.lastInsertRowid) : undefined,
      };
    },
    async close() { client.close(); },
  };
}

async function buildMysqlClient(cfg: DbConfig): Promise<DbClient> {
  const mysql = await import('mysql2/promise');
  const pool = mysql.createPool({
    host: cfg.host || '127.0.0.1',
    port: cfg.port || 3306,
    database: cfg.database || 'mellac',
    user: cfg.username || 'root',
    password: cfg.password || '',
    waitForConnections: true,
    connectionLimit: 10,
  });

  return {
    async execute(sql, args = []) {
      const [rows, fields] = await pool.execute(sql, args) as [Row[], unknown];
      const result = rows as any;
      return {
        rows: Array.isArray(rows) ? rows : [],
        rowsAffected: result.affectedRows,
        lastInsertRowid: result.insertId,
      };
    },
    async close() { await pool.end(); },
  };
}

async function buildPgClient(cfg: DbConfig): Promise<DbClient> {
  const { Pool } = await import('pg');
  const pool = new Pool({
    host: cfg.host || '127.0.0.1',
    port: cfg.port || 5432,
    database: cfg.database || 'mellac',
    user: cfg.username || 'postgres',
    password: cfg.password || '',
  });

  return {
    async execute(sql, args = []) {
      // Convert ? placeholders to $1, $2... for PostgreSQL
      let i = 0;
      const pgSql = sql.replace(/\?/g, () => `$${++i}`);
      const res = await pool.query(pgSql, args);
      return {
        rows: res.rows as Row[],
        rowsAffected: res.rowCount || 0,
        lastInsertRowid: res.rows[0]?.id as number | undefined,
      };
    },
    async close() { await pool.end(); },
  };
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _client: DbClient | null = null;

export async function getDb(): Promise<DbClient> {
  if (_client) return _client;

  const cfg = getDbConfig();

  if (cfg.type === 'none') {
    throw new Error('DB_NOT_CONFIGURED');
  }

  if (cfg.type === 'sqlite') {
    _client = await buildSqliteClient(cfg);
  } else if (cfg.type === 'mysql') {
    _client = await buildMysqlClient(cfg);
  } else if (cfg.type === 'postgresql') {
    _client = await buildPgClient(cfg);
  } else {
    throw new Error(`Unknown DB type: ${cfg.type}`);
  }

  return _client;
}

export function resetDbClient() {
  _client = null;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

export async function initializeDb(): Promise<void> {
  const db = await getDb();

  const cfg = getDbConfig();
  const isPostgres = cfg.type === 'postgresql';

  const autoInc = isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  const now     = isPostgres ? 'NOW()' : 'CURRENT_TIMESTAMP';

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id ${autoInc},
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      api_key TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT ${now},
      updated_at DATETIME DEFAULT ${now}
    )`,
    `CREATE TABLE IF NOT EXISTS servers (
      id ${autoInc},
      user_id INTEGER NOT NULL,
      server_name TEXT NOT NULL,
      server_ip TEXT NOT NULL,
      server_port INTEGER,
      api_key TEXT UNIQUE NOT NULL,
      last_seen DATETIME,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT ${now},
      updated_at DATETIME DEFAULT ${now}
    )`,
    `CREATE TABLE IF NOT EXISTS cheat_logs (
      id ${autoInc},
      server_id INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      player_ip TEXT,
      cheat_type TEXT NOT NULL,
      cheat_reason TEXT,
      severity TEXT DEFAULT 'medium',
      detected_at DATETIME DEFAULT ${now},
      created_at DATETIME DEFAULT ${now}
    )`,
    `CREATE TABLE IF NOT EXISTS player_stats (
      id ${autoInc},
      server_id INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      player_ip TEXT,
      total_detections INTEGER DEFAULT 0,
      last_detection DATETIME,
      is_flagged INTEGER DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT ${now},
      updated_at DATETIME DEFAULT ${now}
    )`,
  ];

  for (const sql of tables) {
    await db.execute(sql);
  }

  // Seed superadmin
  const existing = await db.execute(
    'SELECT id FROM users WHERE email = ?',
    ['holachaneal@gmail.com']
  );
  if (existing.rows.length === 0) {
    const { hashPassword, generateApiKey } = await import('./auth');
    const hash = await hashPassword('hola');
    const key = generateApiKey();
    await db.execute(
      `INSERT INTO users (username, email, password_hash, api_key, role) VALUES (?, ?, ?, ?, ?)`,
      ['admin', 'holachaneal@gmail.com', hash, key, 'superadmin']
    );
  }
}
