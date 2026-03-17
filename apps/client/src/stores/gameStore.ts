import { create } from 'zustand';
import type {
  Room, Player, QuestionPublic, RoundResult, GameResult,
  ChatMessage, PlayerAchievement, LeaderboardEntry,
} from '@trivia/shared';

interface GameState {
  // Connection
  connected: boolean;
  setConnected: (c: boolean) => void;

  // Player
  playerId: string | null;
  username: string;
  setPlayerId: (id: string | null) => void;
  setUsername: (name: string) => void;

  // Room
  room: Room | null;
  setRoom: (room: Room | null) => void;

  // Game flow
  countdown: number | null;
  setCountdown: (n: number | null) => void;

  currentQuestion: QuestionPublic | null;
  setCurrentQuestion: (q: QuestionPublic | null) => void;

  timeLeft: number;
  setTimeLeft: (t: number) => void;

  hasAnswered: boolean;
  selectedAnswer: number | null;
  setAnswered: (index: number) => void;
  resetAnswer: () => void;

  answeredCount: number;
  totalPlayers: number;
  setAnswerProgress: (answered: number, total: number) => void;

  roundResult: RoundResult | null;
  setRoundResult: (r: RoundResult | null) => void;

  gameResult: GameResult | null;
  setGameResult: (r: GameResult | null) => void;

  // Points animation
  lastPointsGained: number;
  setLastPointsGained: (p: number) => void;

  // Streak
  currentStreak: number;
  setCurrentStreak: (s: number) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;

  // Achievements
  newAchievement: PlayerAchievement | null;
  setNewAchievement: (a: PlayerAchievement | null) => void;

  // Reset
  resetGame: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'trivia-player';

function loadPlayer(): { playerId: string | null; username: string } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return { playerId: data.playerId || null, username: data.username || '' };
    }
  } catch {}
  return { playerId: null, username: '' };
}

function savePlayer(playerId: string | null, username: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ playerId, username }));
  } catch {}
}

const savedPlayer = loadPlayer();

export const useGameStore = create<GameState>((set) => ({
  connected: false,
  setConnected: (connected) => set({ connected }),

  playerId: savedPlayer.playerId,
  username: savedPlayer.username,
  setPlayerId: (playerId) => {
    set({ playerId });
    set((s) => { savePlayer(playerId, s.username); return {}; });
  },
  setUsername: (username) => {
    set({ username });
    set((s) => { savePlayer(s.playerId, username); return {}; });
  },

  room: null,
  setRoom: (room) => set({ room }),

  countdown: null,
  setCountdown: (countdown) => set({ countdown }),

  currentQuestion: null,
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),

  timeLeft: 0,
  setTimeLeft: (timeLeft) => set({ timeLeft }),

  hasAnswered: false,
  selectedAnswer: null,
  setAnswered: (index) => set({ hasAnswered: true, selectedAnswer: index }),
  resetAnswer: () => set({ hasAnswered: false, selectedAnswer: null }),

  answeredCount: 0,
  totalPlayers: 0,
  setAnswerProgress: (answeredCount, totalPlayers) => set({ answeredCount, totalPlayers }),

  roundResult: null,
  setRoundResult: (roundResult) => set({ roundResult }),

  gameResult: null,
  setGameResult: (gameResult) => set({ gameResult }),

  lastPointsGained: 0,
  setLastPointsGained: (lastPointsGained) => set({ lastPointsGained }),

  currentStreak: 0,
  setCurrentStreak: (currentStreak) => set({ currentStreak }),

  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages.slice(-99), msg] })),
  clearMessages: () => set({ messages: [] }),

  newAchievement: null,
  setNewAchievement: (newAchievement) => set({ newAchievement }),

  resetGame: () => set({
    countdown: null,
    currentQuestion: null,
    timeLeft: 0,
    hasAnswered: false,
    selectedAnswer: null,
    answeredCount: 0,
    totalPlayers: 0,
    roundResult: null,
    gameResult: null,
    lastPointsGained: 0,
    currentStreak: 0,
    newAchievement: null,
  }),

  resetAll: () => set({
    room: null,
    countdown: null,
    currentQuestion: null,
    timeLeft: 0,
    hasAnswered: false,
    selectedAnswer: null,
    answeredCount: 0,
    totalPlayers: 0,
    roundResult: null,
    gameResult: null,
    lastPointsGained: 0,
    currentStreak: 0,
    messages: [],
    newAchievement: null,
  }),
}));
