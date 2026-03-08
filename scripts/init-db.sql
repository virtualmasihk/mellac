-- MellAC Database Schema

-- Users table (for server admins)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Servers table (Minecraft servers under management)
CREATE TABLE IF NOT EXISTS servers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  server_name TEXT NOT NULL,
  server_ip TEXT NOT NULL,
  server_port INTEGER,
  api_key TEXT UNIQUE NOT NULL,
  last_seen DATETIME,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cheat logs table (Detected cheats/violations)
CREATE TABLE IF NOT EXISTS cheat_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id INTEGER NOT NULL,
  player_name TEXT NOT NULL,
  player_ip TEXT,
  cheat_type TEXT NOT NULL,
  cheat_reason TEXT,
  severity TEXT DEFAULT 'medium',
  detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);

-- Player statistics table (Overall player behavior stats)
CREATE TABLE IF NOT EXISTS player_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id INTEGER NOT NULL,
  player_name TEXT NOT NULL,
  player_ip TEXT,
  total_detections INTEGER DEFAULT 0,
  last_detection DATETIME,
  is_flagged INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  UNIQUE(server_id, player_name)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);
CREATE INDEX IF NOT EXISTS idx_servers_user_id ON servers(user_id);
CREATE INDEX IF NOT EXISTS idx_servers_api_key ON servers(api_key);
CREATE INDEX IF NOT EXISTS idx_cheat_logs_server_id ON cheat_logs(server_id);
CREATE INDEX IF NOT EXISTS idx_cheat_logs_created_at ON cheat_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_player_stats_server_id ON player_stats(server_id);
