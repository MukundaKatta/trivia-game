// ============================================================
// @trivia/shared — Shared types for the trivia game
// ============================================================

// ---------- Categories ----------
export const CATEGORIES = [
  'Science',
  'History',
  'Geography',
  'Entertainment',
  'Sports',
  'Technology',
  'Art',
  'Literature',
] as const;

export type Category = (typeof CATEGORIES)[number];

// ---------- Difficulty ----------
export type Difficulty = 'easy' | 'medium' | 'hard';

// ---------- Question ----------
export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number; // seconds
}

// Sent to clients (no answer)
export interface QuestionPublic {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: string[];
  timeLimit: number;
  questionNumber: number;
  totalQuestions: number;
}

// ---------- Player ----------
export interface Player {
  id: string;
  socketId: string;
  username: string;
  avatarColor: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  score: number;
  streak: number;
  bestStreak: number;
  correctAnswers: number;
  totalAnswers: number;
  achievements: string[];
}

// ---------- Room ----------
export type RoomStatus = 'waiting' | 'starting' | 'playing' | 'reviewing' | 'finished';

export interface RoomSettings {
  maxPlayers: number;
  questionCount: number;
  timePerQuestion: number;
  categories: Category[];
  difficulty: Difficulty | 'mixed';
  isPrivate: boolean;
}

export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  maxPlayers: 8,
  questionCount: 10,
  timePerQuestion: 15,
  categories: [...CATEGORIES],
  difficulty: 'mixed',
  isPrivate: false,
};

export interface Room {
  id: string;
  code: string;
  name: string;
  hostId: string;
  status: RoomStatus;
  settings: RoomSettings;
  players: Player[];
  currentQuestion: number;
  createdAt: string;
}

// ---------- Game State ----------
export interface GameAnswer {
  playerId: string;
  questionId: string;
  selectedIndex: number;
  timeMs: number; // how long they took
  isCorrect: boolean;
  points: number;
}

export interface RoundResult {
  questionId: string;
  correctIndex: number;
  answers: GameAnswer[];
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  playerId: string;
  username: string;
  avatarColor: string;
  score: number;
  streak: number;
  correctAnswers: number;
  totalAnswers: number;
  rank: number;
  scoreChange: number;
}

export interface GameResult {
  roomId: string;
  leaderboard: LeaderboardEntry[];
  achievements: PlayerAchievement[];
  duration: number;
}

// ---------- Achievements ----------
export const ACHIEVEMENTS = {
  SHARPSHOOTER: {
    id: 'SHARPSHOOTER',
    name: 'Sharpshooter',
    description: 'Answer 5 questions correctly in a row',
    icon: '🎯',
  },
  SPEED_DEMON: {
    id: 'SPEED_DEMON',
    name: 'Speed Demon',
    description: 'Answer a question in under 2 seconds',
    icon: '⚡',
  },
  ON_FIRE: {
    id: 'ON_FIRE',
    name: 'On Fire',
    description: 'Get a 3-question streak',
    icon: '🔥',
  },
  CHAMPION: {
    id: 'CHAMPION',
    name: 'Champion',
    description: 'Win a game',
    icon: '🏆',
  },
  PERFECT_GAME: {
    id: 'PERFECT_GAME',
    name: 'Perfect Game',
    description: 'Answer all questions correctly',
    icon: '💎',
  },
  COMEBACK_KID: {
    id: 'COMEBACK_KID',
    name: 'Comeback Kid',
    description: 'Win after being last at halftime',
    icon: '🔄',
  },
  BRAINIAC: {
    id: 'BRAINIAC',
    name: 'Brainiac',
    description: 'Score over 1000 points in a single game',
    icon: '🧠',
  },
  SOCIAL_BUTTERFLY: {
    id: 'SOCIAL_BUTTERFLY',
    name: 'Social Butterfly',
    description: 'Send 10 chat messages in a game',
    icon: '🦋',
  },
  FIRST_BLOOD: {
    id: 'FIRST_BLOOD',
    name: 'First Blood',
    description: 'Be the first to answer correctly',
    icon: '🗡️',
  },
  MARATHON: {
    id: 'MARATHON',
    name: 'Marathon',
    description: 'Play 5 games',
    icon: '🏃',
  },
  SCIENCE_WHIZ: {
    id: 'SCIENCE_WHIZ',
    name: 'Science Whiz',
    description: 'Get 5 Science questions right',
    icon: '🔬',
  },
  HISTORY_BUFF: {
    id: 'HISTORY_BUFF',
    name: 'History Buff',
    description: 'Get 5 History questions right',
    icon: '📜',
  },
  GLOBE_TROTTER: {
    id: 'GLOBE_TROTTER',
    name: 'Globe Trotter',
    description: 'Get 5 Geography questions right',
    icon: '🌍',
  },
  UNBEATABLE: {
    id: 'UNBEATABLE',
    name: 'Unbeatable',
    description: 'Win 3 games in a row',
    icon: '👑',
  },
  QUICK_DRAW: {
    id: 'QUICK_DRAW',
    name: 'Quick Draw',
    description: 'Answer first in 3 consecutive rounds',
    icon: '🤠',
  },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

export interface PlayerAchievement {
  playerId: string;
  username: string;
  achievementId: AchievementId;
  unlockedAt: string;
}

// ---------- Chat ----------
export interface ChatMessage {
  id: string;
  roomId: string;
  playerId: string;
  username: string;
  avatarColor: string;
  message: string;
  timestamp: string;
}

// ---------- Socket Events ----------

// Client -> Server
export interface ClientEvents {
  'room:create': (data: { username: string; roomName: string; settings?: Partial<RoomSettings> }) => void;
  'room:join': (data: { username: string; roomCode: string }) => void;
  'room:leave': () => void;
  'room:settings': (data: Partial<RoomSettings>) => void;
  'room:ready': () => void;
  'room:kick': (data: { playerId: string }) => void;
  'game:start': () => void;
  'game:answer': (data: { questionId: string; selectedIndex: number; timeMs: number }) => void;
  'chat:message': (data: { message: string }) => void;
  'player:reconnect': (data: { playerId: string; roomCode: string }) => void;
}

// Server -> Client
export interface ServerEvents {
  'room:created': (data: { room: Room; playerId: string }) => void;
  'room:joined': (data: { room: Room; playerId: string }) => void;
  'room:updated': (data: { room: Room }) => void;
  'room:player-joined': (data: { player: Player }) => void;
  'room:player-left': (data: { playerId: string }) => void;
  'room:error': (data: { message: string }) => void;
  'game:starting': (data: { countdown: number }) => void;
  'game:question': (data: { question: QuestionPublic }) => void;
  'game:tick': (data: { timeLeft: number }) => void;
  'game:player-answered': (data: { playerId: string; totalAnswered: number; totalPlayers: number }) => void;
  'game:round-result': (data: RoundResult) => void;
  'game:finished': (data: GameResult) => void;
  'chat:message': (data: ChatMessage) => void;
  'player:reconnected': (data: { playerId: string }) => void;
  'player:disconnected': (data: { playerId: string }) => void;
  'achievement:unlocked': (data: PlayerAchievement) => void;
}

// ---------- Scoring ----------
export const SCORING = {
  BASE_POINTS: 100,
  TIME_BONUS_MAX: 50,
  STREAK_MULTIPLIER: 0.1, // 10% per streak level
  MAX_STREAK_BONUS: 0.5, // 50% max
  DIFFICULTY_MULTIPLIER: {
    easy: 1,
    medium: 1.5,
    hard: 2,
  },
} as const;

export function calculateScore(
  isCorrect: boolean,
  timeMs: number,
  timeLimitMs: number,
  streak: number,
  difficulty: Difficulty
): number {
  if (!isCorrect) return 0;
  const base = SCORING.BASE_POINTS;
  const timeRatio = Math.max(0, 1 - timeMs / timeLimitMs);
  const timeBonus = Math.round(SCORING.TIME_BONUS_MAX * timeRatio);
  const streakBonus = Math.min(streak * SCORING.STREAK_MULTIPLIER, SCORING.MAX_STREAK_BONUS);
  const diffMultiplier = SCORING.DIFFICULTY_MULTIPLIER[difficulty];
  return Math.round((base + timeBonus) * (1 + streakBonus) * diffMultiplier);
}

// ---------- Helpers ----------
export const AVATAR_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
];

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
