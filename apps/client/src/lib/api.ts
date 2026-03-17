const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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

export function fetchHealth() {
  return fetchJson<{ status: string; questionCount: number }>('/api/health');
}

export function fetchRooms() {
  return fetchJson<any[]>('/api/rooms');
}

export function fetchRoom(code: string) {
  return fetchJson<any>(`/api/rooms/${code}`);
}

export function fetchLeaderboard() {
  return fetchJson<PlayerStats[]>('/api/leaderboard');
}

export function fetchPlayerStats(id: string) {
  return fetchJson<PlayerStats>(`/api/players/${id}`);
}
