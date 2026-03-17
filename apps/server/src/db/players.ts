import { getDb } from './schema.js';

interface PlayerRow {
  id: string;
  username: string;
  avatar_color: string;
  games_played: number;
  games_won: number;
  total_score: number;
  total_correct: number;
  total_answered: number;
  best_streak: number;
  achievements: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  id: string;
  username: string;
  avatarColor: string;
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  totalCorrect: number;
  totalAnswered: number;
  bestStreak: number;
  achievements: string[];
}

function rowToStats(row: PlayerRow): PlayerStats {
  return {
    id: row.id,
    username: row.username,
    avatarColor: row.avatar_color,
    gamesPlayed: row.games_played,
    gamesWon: row.games_won,
    totalScore: row.total_score,
    totalCorrect: row.total_correct,
    totalAnswered: row.total_answered,
    bestStreak: row.best_streak,
    achievements: JSON.parse(row.achievements),
  };
}

export function upsertPlayer(id: string, username: string, avatarColor: string): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO players (id, username, avatar_color)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET username = excluded.username, updated_at = datetime('now')
  `).run(id, username, avatarColor);
}

export function updatePlayerStats(
  id: string,
  won: boolean,
  score: number,
  correct: number,
  answered: number,
  streak: number,
  newAchievements: string[]
): void {
  const db = getDb();
  const existing = db.prepare('SELECT achievements, best_streak FROM players WHERE id = ?').get(id) as
    | { achievements: string; best_streak: number }
    | undefined;

  if (!existing) return;

  const currentAchievements: string[] = JSON.parse(existing.achievements);
  const allAchievements = [...new Set([...currentAchievements, ...newAchievements])];
  const bestStreak = Math.max(existing.best_streak, streak);

  db.prepare(`
    UPDATE players SET
      games_played = games_played + 1,
      games_won = games_won + ?,
      total_score = total_score + ?,
      total_correct = total_correct + ?,
      total_answered = total_answered + ?,
      best_streak = ?,
      achievements = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(won ? 1 : 0, score, correct, answered, bestStreak, JSON.stringify(allAchievements), id);
}

export function getPlayerStats(id: string): PlayerStats | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM players WHERE id = ?').get(id) as PlayerRow | undefined;
  return row ? rowToStats(row) : null;
}

export function getTopPlayers(limit = 20): PlayerStats[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM players ORDER BY total_score DESC LIMIT ?').all(limit) as PlayerRow[];
  return rows.map(rowToStats);
}
