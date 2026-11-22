-- Migration: Create users and notifications tables
-- This replaces the Prisma PostgreSQL schema with D1 SQLite schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  hook_id TEXT UNIQUE,
  password TEXT,
  expo_push_tokens TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login INTEGER NOT NULL DEFAULT (unixepoch()),
  onboarding_completed INTEGER NOT NULL DEFAULT 0,
  muted_until INTEGER,
  gitlab_id INTEGER UNIQUE
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT,
  headers TEXT NOT NULL,
  recived INTEGER NOT NULL DEFAULT (unixepoch()),
  viewed INTEGER NOT NULL DEFAULT 0,
  content_hash TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recived ON notifications(recived);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_hook_id ON users(hook_id);
CREATE INDEX IF NOT EXISTS idx_users_gitlab_id ON users(gitlab_id);
