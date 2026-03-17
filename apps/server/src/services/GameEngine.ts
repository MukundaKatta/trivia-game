import { v4 as uuid } from 'uuid';
import type {
  Room, Player, RoomSettings, RoomStatus, Question, QuestionPublic,
  GameAnswer, RoundResult, LeaderboardEntry, GameResult, PlayerAchievement,
  AchievementId, Category,
} from '@trivia/shared';
import {
  DEFAULT_ROOM_SETTINGS, AVATAR_COLORS, generateRoomCode, calculateScore,
} from '@trivia/shared';
import { getRandomQuestions } from '../db/questions.js';
import { upsertPlayer, updatePlayerStats } from '../db/players.js';

// ---------- In-Memory State ----------
const rooms = new Map<string, RoomState>();
const playerRoomMap = new Map<string, string>(); // socketId -> roomId
const playerIdMap = new Map<string, string>(); // playerId -> roomId
const disconnectedPlayers = new Map<string, { playerId: string; roomId: string; timeout: NodeJS.Timeout }>();

interface RoomState {
  room: Room;
  questions: Question[];
  answers: Map<string, GameAnswer[]>; // playerId -> answers
  currentTimer: NodeJS.Timeout | null;
  roundStartTime: number;
  chatMessageCounts: Map<string, number>;
  firstAnswerPerRound: Map<number, string>; // round -> playerId
  halfTimeRanks: Map<string, number>;
  consecutiveFirstAnswers: Map<string, number>;
}

export function getRooms(): Room[] {
  return Array.from(rooms.values())
    .map((s) => s.room)
    .filter((r) => !r.settings.isPrivate && r.status === 'waiting');
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId)?.room;
}

export function getRoomByCode(code: string): Room | undefined {
  for (const state of rooms.values()) {
    if (state.room.code === code) return state.room;
  }
  return undefined;
}

export function getRoomState(roomId: string): RoomState | undefined {
  return rooms.get(roomId);
}

export function getRoomForSocket(socketId: string): RoomState | undefined {
  const roomId = playerRoomMap.get(socketId);
  if (!roomId) return undefined;
  return rooms.get(roomId);
}

export function getPlayerForSocket(socketId: string): Player | undefined {
  const state = getRoomForSocket(socketId);
  if (!state) return undefined;
  return state.room.players.find((p) => p.socketId === socketId);
}

// ---------- Room Management ----------

export function createRoom(
  socketId: string,
  username: string,
  roomName: string,
  settings?: Partial<RoomSettings>
): { room: Room; playerId: string } {
  const roomId = uuid();
  const playerId = uuid();
  const code = generateRoomCode();
  const avatarColor = AVATAR_COLORS[0];

  const player: Player = {
    id: playerId,
    socketId,
    username,
    avatarColor,
    isHost: true,
    isReady: true,
    isConnected: true,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    achievements: [],
  };

  const room: Room = {
    id: roomId,
    code,
    name: roomName,
    hostId: playerId,
    status: 'waiting',
    settings: { ...DEFAULT_ROOM_SETTINGS, ...settings },
    players: [player],
    currentQuestion: 0,
    createdAt: new Date().toISOString(),
  };

  const state: RoomState = {
    room,
    questions: [],
    answers: new Map(),
    currentTimer: null,
    roundStartTime: 0,
    chatMessageCounts: new Map(),
    firstAnswerPerRound: new Map(),
    halfTimeRanks: new Map(),
    consecutiveFirstAnswers: new Map(),
  };

  rooms.set(roomId, state);
  playerRoomMap.set(socketId, roomId);
  playerIdMap.set(playerId, roomId);
  upsertPlayer(playerId, username, avatarColor);

  return { room, playerId };
}

export function joinRoom(
  socketId: string,
  username: string,
  roomCode: string
): { room: Room; playerId: string; player: Player } | { error: string } {
  const state = Array.from(rooms.values()).find((s) => s.room.code === roomCode);
  if (!state) return { error: 'Room not found' };
  if (state.room.status !== 'waiting') return { error: 'Game already in progress' };
  if (state.room.players.length >= state.room.settings.maxPlayers)
    return { error: 'Room is full' };
  if (state.room.players.some((p) => p.username === username))
    return { error: 'Username already taken in this room' };

  const playerId = uuid();
  const avatarColor = AVATAR_COLORS[state.room.players.length % AVATAR_COLORS.length];

  const player: Player = {
    id: playerId,
    socketId,
    username,
    avatarColor,
    isHost: false,
    isReady: false,
    isConnected: true,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    achievements: [],
  };

  state.room.players.push(player);
  playerRoomMap.set(socketId, state.room.id);
  playerIdMap.set(playerId, state.room.id);
  upsertPlayer(playerId, username, avatarColor);

  return { room: state.room, playerId, player };
}

export function leaveRoom(socketId: string): { room: Room; playerId: string } | null {
  const state = getRoomForSocket(socketId);
  if (!state) return null;

  const player = state.room.players.find((p) => p.socketId === socketId);
  if (!player) return null;

  state.room.players = state.room.players.filter((p) => p.id !== player.id);
  playerRoomMap.delete(socketId);
  playerIdMap.delete(player.id);

  // If host left, assign new host
  if (player.isHost && state.room.players.length > 0) {
    state.room.players[0].isHost = true;
    state.room.hostId = state.room.players[0].id;
  }

  // If room is empty, clean up
  if (state.room.players.length === 0) {
    if (state.currentTimer) clearTimeout(state.currentTimer);
    rooms.delete(state.room.id);
    return { room: state.room, playerId: player.id };
  }

  return { room: state.room, playerId: player.id };
}

export function setReady(socketId: string): Room | null {
  const state = getRoomForSocket(socketId);
  if (!state) return null;
  const player = state.room.players.find((p) => p.socketId === socketId);
  if (!player) return null;
  player.isReady = !player.isReady;
  return state.room;
}

export function updateSettings(socketId: string, settings: Partial<RoomSettings>): Room | null {
  const state = getRoomForSocket(socketId);
  if (!state) return null;
  const player = state.room.players.find((p) => p.socketId === socketId);
  if (!player || !player.isHost) return null;
  state.room.settings = { ...state.room.settings, ...settings };
  return state.room;
}

export function kickPlayer(socketId: string, targetPlayerId: string): { room: Room; kickedSocketId: string } | null {
  const state = getRoomForSocket(socketId);
  if (!state) return null;
  const requester = state.room.players.find((p) => p.socketId === socketId);
  if (!requester || !requester.isHost) return null;
  const target = state.room.players.find((p) => p.id === targetPlayerId);
  if (!target) return null;

  const kickedSocketId = target.socketId;
  state.room.players = state.room.players.filter((p) => p.id !== targetPlayerId);
  playerRoomMap.delete(target.socketId);
  playerIdMap.delete(target.id);

  return { room: state.room, kickedSocketId };
}

// ---------- Game Flow ----------

export function canStartGame(socketId: string): { ok: boolean; error?: string } {
  const state = getRoomForSocket(socketId);
  if (!state) return { ok: false, error: 'Room not found' };
  const player = state.room.players.find((p) => p.socketId === socketId);
  if (!player || !player.isHost) return { ok: false, error: 'Only the host can start the game' };
  if (state.room.players.length < 1) return { ok: false, error: 'Need at least 1 player' };
  if (state.room.status !== 'waiting') return { ok: false, error: 'Game already started' };
  return { ok: true };
}

export function startGame(roomId: string): Question[] | null {
  const state = rooms.get(roomId);
  if (!state) return null;

  const { settings } = state.room;
  const questions = getRandomQuestions(settings.questionCount, settings.categories, settings.difficulty);

  if (questions.length === 0) return null;

  state.questions = questions;
  state.room.status = 'starting';
  state.room.currentQuestion = 0;
  state.answers = new Map();
  state.chatMessageCounts = new Map();
  state.firstAnswerPerRound = new Map();
  state.halfTimeRanks = new Map();
  state.consecutiveFirstAnswers = new Map();

  // Reset player scores
  for (const player of state.room.players) {
    player.score = 0;
    player.streak = 0;
    player.bestStreak = 0;
    player.correctAnswers = 0;
    player.totalAnswers = 0;
    player.isReady = true;
  }

  return questions;
}

export function getNextQuestion(roomId: string): QuestionPublic | null {
  const state = rooms.get(roomId);
  if (!state) return null;

  const idx = state.room.currentQuestion;
  if (idx >= state.questions.length) return null;

  const q = state.questions[idx];
  state.room.status = 'playing';
  state.roundStartTime = Date.now();

  return {
    id: q.id,
    category: q.category,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options,
    timeLimit: state.room.settings.timePerQuestion,
    questionNumber: idx + 1,
    totalQuestions: state.questions.length,
  };
}

export function submitAnswer(
  socketId: string,
  questionId: string,
  selectedIndex: number,
  timeMs: number
): GameAnswer | null {
  const state = getRoomForSocket(socketId);
  if (!state || state.room.status !== 'playing') return null;

  const player = state.room.players.find((p) => p.socketId === socketId);
  if (!player) return null;

  const currentQ = state.questions[state.room.currentQuestion];
  if (!currentQ || currentQ.id !== questionId) return null;

  // Check if already answered
  const existing = state.answers.get(player.id) || [];
  if (existing.some((a) => a.questionId === questionId)) return null;

  const isCorrect = selectedIndex === currentQ.correctIndex;
  const timeLimitMs = state.room.settings.timePerQuestion * 1000;
  const clampedTime = Math.min(timeMs, timeLimitMs);

  if (isCorrect) {
    player.streak++;
    player.correctAnswers++;
  } else {
    player.streak = 0;
  }
  player.bestStreak = Math.max(player.bestStreak, player.streak);
  player.totalAnswers++;

  const points = calculateScore(isCorrect, clampedTime, timeLimitMs, player.streak, currentQ.difficulty);
  player.score += points;

  const answer: GameAnswer = {
    playerId: player.id,
    questionId,
    selectedIndex,
    timeMs: clampedTime,
    isCorrect,
    points,
  };

  existing.push(answer);
  state.answers.set(player.id, existing);

  // Track first answer per round
  const roundIdx = state.room.currentQuestion;
  if (isCorrect && !state.firstAnswerPerRound.has(roundIdx)) {
    state.firstAnswerPerRound.set(roundIdx, player.id);

    // Track consecutive first answers
    const consec = (state.consecutiveFirstAnswers.get(player.id) || 0) + 1;
    state.consecutiveFirstAnswers.set(player.id, consec);
  }

  return answer;
}

export function allPlayersAnswered(roomId: string): boolean {
  const state = rooms.get(roomId);
  if (!state) return false;

  const connectedPlayers = state.room.players.filter((p) => p.isConnected);
  const currentQ = state.questions[state.room.currentQuestion];
  if (!currentQ) return false;

  for (const player of connectedPlayers) {
    const answers = state.answers.get(player.id) || [];
    if (!answers.some((a) => a.questionId === currentQ.id)) return false;
  }
  return true;
}

export function getAnsweredCount(roomId: string): number {
  const state = rooms.get(roomId);
  if (!state) return 0;
  const currentQ = state.questions[state.room.currentQuestion];
  if (!currentQ) return 0;

  let count = 0;
  for (const player of state.room.players) {
    const answers = state.answers.get(player.id) || [];
    if (answers.some((a) => a.questionId === currentQ.id)) count++;
  }
  return count;
}

export function buildLeaderboard(roomId: string): LeaderboardEntry[] {
  const state = rooms.get(roomId);
  if (!state) return [];

  const entries: LeaderboardEntry[] = state.room.players
    .map((p) => ({
      playerId: p.id,
      username: p.username,
      avatarColor: p.avatarColor,
      score: p.score,
      streak: p.streak,
      correctAnswers: p.correctAnswers,
      totalAnswers: p.totalAnswers,
      rank: 0,
      scoreChange: 0,
    }))
    .sort((a, b) => b.score - a.score);

  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  // Calculate score change from last answer
  const currentQ = state.questions[state.room.currentQuestion];
  if (currentQ) {
    for (const entry of entries) {
      const answers = state.answers.get(entry.playerId) || [];
      const lastAnswer = answers.find((a) => a.questionId === currentQ.id);
      entry.scoreChange = lastAnswer?.points || 0;
    }
  }

  return entries;
}

export function getRoundResult(roomId: string): RoundResult | null {
  const state = rooms.get(roomId);
  if (!state) return null;

  const currentQ = state.questions[state.room.currentQuestion];
  if (!currentQ) return null;

  state.room.status = 'reviewing';

  const answers: GameAnswer[] = [];
  for (const player of state.room.players) {
    const playerAnswers = state.answers.get(player.id) || [];
    const answer = playerAnswers.find((a) => a.questionId === currentQ.id);
    if (answer) answers.push(answer);
  }

  const leaderboard = buildLeaderboard(roomId);

  // Track half-time ranks
  const halfPoint = Math.floor(state.questions.length / 2);
  if (state.room.currentQuestion === halfPoint) {
    for (const entry of leaderboard) {
      state.halfTimeRanks.set(entry.playerId, entry.rank);
    }
  }

  return {
    questionId: currentQ.id,
    correctIndex: currentQ.correctIndex,
    answers,
    leaderboard,
  };
}

export function advanceQuestion(roomId: string): boolean {
  const state = rooms.get(roomId);
  if (!state) return false;
  state.room.currentQuestion++;
  return state.room.currentQuestion < state.questions.length;
}

export function finishGame(roomId: string): GameResult | null {
  const state = rooms.get(roomId);
  if (!state) return null;

  state.room.status = 'finished';
  if (state.currentTimer) {
    clearTimeout(state.currentTimer);
    state.currentTimer = null;
  }

  const leaderboard = buildLeaderboard(roomId);
  const achievements = checkAchievements(state, leaderboard);
  const duration = Math.round((Date.now() - new Date(state.room.createdAt).getTime()) / 1000);

  // Update player stats in DB
  for (const entry of leaderboard) {
    const playerAchievements = achievements
      .filter((a) => a.playerId === entry.playerId)
      .map((a) => a.achievementId);
    updatePlayerStats(
      entry.playerId,
      entry.rank === 1,
      entry.score,
      entry.correctAnswers,
      entry.totalAnswers,
      state.room.players.find((p) => p.id === entry.playerId)?.bestStreak || 0,
      playerAchievements
    );
  }

  return { roomId, leaderboard, achievements, duration };
}

function checkAchievements(state: RoomState, leaderboard: LeaderboardEntry[]): PlayerAchievement[] {
  const achievements: PlayerAchievement[] = [];
  const now = new Date().toISOString();

  for (const player of state.room.players) {
    const entry = leaderboard.find((e) => e.playerId === player.id)!;

    // CHAMPION - won the game
    if (entry.rank === 1) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'CHAMPION', unlockedAt: now });
    }

    // SHARPSHOOTER - 5 in a row
    if (player.bestStreak >= 5) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'SHARPSHOOTER', unlockedAt: now });
    }

    // ON_FIRE - 3 streak
    if (player.bestStreak >= 3) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'ON_FIRE', unlockedAt: now });
    }

    // PERFECT_GAME - all correct
    if (player.correctAnswers === state.questions.length) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'PERFECT_GAME', unlockedAt: now });
    }

    // BRAINIAC - score > 1000
    if (player.score > 1000) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'BRAINIAC', unlockedAt: now });
    }

    // SPEED_DEMON - answered in under 2 seconds
    const answers = state.answers.get(player.id) || [];
    if (answers.some((a) => a.isCorrect && a.timeMs < 2000)) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'SPEED_DEMON', unlockedAt: now });
    }

    // FIRST_BLOOD - was first to answer correctly in any round
    for (const [, firstPlayerId] of state.firstAnswerPerRound) {
      if (firstPlayerId === player.id) {
        achievements.push({ playerId: player.id, username: player.username, achievementId: 'FIRST_BLOOD', unlockedAt: now });
        break;
      }
    }

    // COMEBACK_KID - was last at halftime but won
    const halfTimeRank = state.halfTimeRanks.get(player.id);
    if (halfTimeRank === state.room.players.length && entry.rank === 1 && state.room.players.length > 1) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'COMEBACK_KID', unlockedAt: now });
    }

    // SOCIAL_BUTTERFLY - 10+ chat messages
    const chatCount = state.chatMessageCounts.get(player.id) || 0;
    if (chatCount >= 10) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'SOCIAL_BUTTERFLY', unlockedAt: now });
    }

    // QUICK_DRAW - first answer 3 consecutive rounds
    const consec = state.consecutiveFirstAnswers.get(player.id) || 0;
    if (consec >= 3) {
      achievements.push({ playerId: player.id, username: player.username, achievementId: 'QUICK_DRAW', unlockedAt: now });
    }
  }

  return achievements;
}

// ---------- Reconnection ----------

export function handleDisconnect(socketId: string): { room: Room; playerId: string } | null {
  const state = getRoomForSocket(socketId);
  if (!state) return null;

  const player = state.room.players.find((p) => p.socketId === socketId);
  if (!player) return null;

  // If in waiting state, just remove
  if (state.room.status === 'waiting') {
    return leaveRoom(socketId);
  }

  // During game: mark disconnected and give 30s to reconnect
  player.isConnected = false;
  playerRoomMap.delete(socketId);

  const timeout = setTimeout(() => {
    // Remove player after 30s
    disconnectedPlayers.delete(player.id);
    state.room.players = state.room.players.filter((p) => p.id !== player.id);
    playerIdMap.delete(player.id);
    if (state.room.players.length === 0) {
      if (state.currentTimer) clearTimeout(state.currentTimer);
      rooms.delete(state.room.id);
    }
  }, 30000);

  disconnectedPlayers.set(player.id, { playerId: player.id, roomId: state.room.id, timeout });

  return { room: state.room, playerId: player.id };
}

export function handleReconnect(
  socketId: string,
  playerId: string,
  roomCode: string
): { room: Room } | { error: string } {
  const disconnected = disconnectedPlayers.get(playerId);
  if (!disconnected) return { error: 'No reconnection available' };

  const state = rooms.get(disconnected.roomId);
  if (!state || state.room.code !== roomCode) return { error: 'Room not found' };

  const player = state.room.players.find((p) => p.id === playerId);
  if (!player) return { error: 'Player not found' };

  clearTimeout(disconnected.timeout);
  disconnectedPlayers.delete(playerId);

  player.socketId = socketId;
  player.isConnected = true;
  playerRoomMap.set(socketId, state.room.id);

  return { room: state.room };
}

// ---------- Chat ----------

export function trackChatMessage(roomId: string, playerId: string): void {
  const state = rooms.get(roomId);
  if (!state) return;
  const count = state.chatMessageCounts.get(playerId) || 0;
  state.chatMessageCounts.set(playerId, count + 1);
}

export function setRoomTimer(roomId: string, timer: NodeJS.Timeout): void {
  const state = rooms.get(roomId);
  if (state) state.currentTimer = timer;
}

export function clearRoomTimer(roomId: string): void {
  const state = rooms.get(roomId);
  if (state && state.currentTimer) {
    clearTimeout(state.currentTimer);
    state.currentTimer = null;
  }
}

// Reset room to waiting after game ends
export function resetRoom(roomId: string): Room | null {
  const state = rooms.get(roomId);
  if (!state) return null;

  state.room.status = 'waiting';
  state.room.currentQuestion = 0;
  state.questions = [];
  state.answers = new Map();
  for (const player of state.room.players) {
    player.score = 0;
    player.streak = 0;
    player.bestStreak = 0;
    player.correctAnswers = 0;
    player.totalAnswers = 0;
    player.isReady = player.isHost;
  }
  return state.room;
}
