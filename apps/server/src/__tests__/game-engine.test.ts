import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the DB modules before importing the engine
vi.mock('../db/questions.js', () => ({
  getRandomQuestions: vi.fn(() => [
    {
      id: 'q1',
      category: 'Science',
      difficulty: 'easy',
      question: 'What planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctIndex: 1,
      timeLimit: 15,
    },
    {
      id: 'q2',
      category: 'History',
      difficulty: 'medium',
      question: 'In what year did WWII end?',
      options: ['1943', '1944', '1945', '1946'],
      correctIndex: 2,
      timeLimit: 15,
    },
    {
      id: 'q3',
      category: 'Geography',
      difficulty: 'easy',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Madrid', 'Paris'],
      correctIndex: 3,
      timeLimit: 15,
    },
  ]),
  getQuestionById: vi.fn(),
  getQuestionCount: vi.fn(() => 200),
}));

vi.mock('../db/players.js', () => ({
  upsertPlayer: vi.fn(),
  updatePlayerStats: vi.fn(),
  getPlayerStats: vi.fn(),
  getTopPlayers: vi.fn(() => []),
}));

vi.mock('../db/schema.js', () => ({
  getDb: vi.fn(() => ({
    pragma: vi.fn(),
    exec: vi.fn(),
    prepare: vi.fn(() => ({
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(() => []),
    })),
  })),
}));

// Dynamic import so mocks apply
const engine = await import('../services/GameEngine.js');

describe('GameEngine', () => {
  describe('Room Management', () => {
    it('should create a room', () => {
      const result = engine.createRoom('socket1', 'Alice', 'Test Room');
      expect(result.room).toBeDefined();
      expect(result.playerId).toBeDefined();
      expect(result.room.name).toBe('Test Room');
      expect(result.room.code).toHaveLength(6);
      expect(result.room.players).toHaveLength(1);
      expect(result.room.players[0].username).toBe('Alice');
      expect(result.room.players[0].isHost).toBe(true);
      expect(result.room.status).toBe('waiting');
    });

    it('should join a room', () => {
      const { room } = engine.createRoom('socket-host', 'Host', 'Room');
      const joinResult = engine.joinRoom('socket-joiner', 'Joiner', room.code);

      expect('error' in joinResult).toBe(false);
      if (!('error' in joinResult)) {
        expect(joinResult.room.players).toHaveLength(2);
        expect(joinResult.player.username).toBe('Joiner');
        expect(joinResult.player.isHost).toBe(false);
      }
    });

    it('should reject joining with duplicate username', () => {
      const { room } = engine.createRoom('socket-h2', 'DupeUser', 'Room');
      const result = engine.joinRoom('socket-j2', 'DupeUser', room.code);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toContain('Username already taken');
      }
    });

    it('should reject joining non-existent room', () => {
      const result = engine.joinRoom('socket-x', 'User', 'ZZZZZZ');
      expect('error' in result).toBe(true);
    });

    it('should handle leaving a room', () => {
      const { room } = engine.createRoom('socket-leave', 'Leaver', 'Room');
      engine.joinRoom('socket-stay', 'Stayer', room.code);

      const result = engine.leaveRoom('socket-leave');
      expect(result).not.toBeNull();
      if (result) {
        expect(result.room.players).toHaveLength(1);
        // New host should be assigned
        expect(result.room.players[0].isHost).toBe(true);
        expect(result.room.players[0].username).toBe('Stayer');
      }
    });

    it('should toggle ready state', () => {
      const { room } = engine.createRoom('socket-rdy-h', 'Host', 'Room');
      engine.joinRoom('socket-rdy-j', 'Player', room.code);

      // Player is not ready initially
      const state = engine.getRoomForSocket('socket-rdy-j');
      const player = state?.room.players.find((p) => p.username === 'Player');
      expect(player?.isReady).toBe(false);

      engine.setReady('socket-rdy-j');
      const state2 = engine.getRoomForSocket('socket-rdy-j');
      const player2 = state2?.room.players.find((p) => p.username === 'Player');
      expect(player2?.isReady).toBe(true);
    });

    it('should kick a player (host only)', () => {
      const { room } = engine.createRoom('socket-kick-h', 'Host', 'Room');
      const joined = engine.joinRoom('socket-kick-j', 'Target', room.code);
      if ('error' in joined) throw new Error('Join failed');

      const result = engine.kickPlayer('socket-kick-h', joined.playerId);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.room.players).toHaveLength(1);
      }
    });

    it('should not let non-host kick', () => {
      const { room } = engine.createRoom('socket-nk-h', 'Host', 'Room');
      engine.joinRoom('socket-nk-j', 'Joiner', room.code);

      const result = engine.kickPlayer('socket-nk-j', room.hostId);
      expect(result).toBeNull();
    });
  });

  describe('Game Flow', () => {
    it('should start a game and get questions', () => {
      const { room } = engine.createRoom('socket-game-h', 'GameHost', 'Game Room');
      engine.joinRoom('socket-game-j', 'GamePlayer', room.code);

      // Ready up player
      engine.setReady('socket-game-j');

      const canStart = engine.canStartGame('socket-game-h');
      expect(canStart.ok).toBe(true);

      const questions = engine.startGame(room.id);
      expect(questions).not.toBeNull();
      expect(questions!.length).toBeGreaterThan(0);
      expect(room.status).toBe('starting');
    });

    it('should not let non-host start game', () => {
      const { room } = engine.createRoom('socket-nostart-h', 'Host', 'Room');
      engine.joinRoom('socket-nostart-j', 'Joiner', room.code);

      const canStart = engine.canStartGame('socket-nostart-j');
      expect(canStart.ok).toBe(false);
    });

    it('should submit answers and track scores', () => {
      const { room } = engine.createRoom('socket-ans-h', 'AnswerHost', 'AnswerRoom');
      const joined = engine.joinRoom('socket-ans-j', 'AnswerPlayer', room.code);
      if ('error' in joined) throw new Error('Join failed');

      engine.setReady('socket-ans-j');
      engine.startGame(room.id);
      const question = engine.getNextQuestion(room.id);
      expect(question).not.toBeNull();

      // Submit correct answer
      const answer = engine.submitAnswer('socket-ans-h', question!.id, 1, 3000); // Mars is index 1
      expect(answer).not.toBeNull();
      expect(answer!.isCorrect).toBe(true);
      expect(answer!.points).toBeGreaterThan(0);

      // Submit wrong answer
      const answer2 = engine.submitAnswer('socket-ans-j', question!.id, 0, 5000);
      expect(answer2).not.toBeNull();
      expect(answer2!.isCorrect).toBe(false);
      expect(answer2!.points).toBe(0);
    });

    it('should detect when all players answered', () => {
      const { room } = engine.createRoom('socket-all-h', 'Host', 'AllRoom');
      engine.joinRoom('socket-all-j', 'Player', room.code);
      engine.setReady('socket-all-j');
      engine.startGame(room.id);

      const q = engine.getNextQuestion(room.id);

      expect(engine.allPlayersAnswered(room.id)).toBe(false);

      engine.submitAnswer('socket-all-h', q!.id, 1, 1000);
      expect(engine.allPlayersAnswered(room.id)).toBe(false);

      engine.submitAnswer('socket-all-j', q!.id, 0, 2000);
      expect(engine.allPlayersAnswered(room.id)).toBe(true);
    });

    it('should build leaderboard correctly', () => {
      const { room } = engine.createRoom('socket-lb-h', 'Host', 'LBRoom');
      engine.joinRoom('socket-lb-j', 'Player', room.code);
      engine.setReady('socket-lb-j');
      engine.startGame(room.id);

      const q = engine.getNextQuestion(room.id);
      engine.submitAnswer('socket-lb-h', q!.id, 1, 1000); // correct, fast
      engine.submitAnswer('socket-lb-j', q!.id, 0, 2000); // wrong

      const lb = engine.buildLeaderboard(room.id);
      expect(lb).toHaveLength(2);
      expect(lb[0].score).toBeGreaterThan(0);
      expect(lb[1].score).toBe(0);
      expect(lb[0].rank).toBe(1);
      expect(lb[1].rank).toBe(2);
    });

    it('should get round result', () => {
      const { room } = engine.createRoom('socket-rr-h', 'Host', 'RRRoom');
      engine.joinRoom('socket-rr-j', 'Player', room.code);
      engine.setReady('socket-rr-j');
      engine.startGame(room.id);

      const q = engine.getNextQuestion(room.id);
      engine.submitAnswer('socket-rr-h', q!.id, 1, 2000);
      engine.submitAnswer('socket-rr-j', q!.id, 1, 3000);

      const result = engine.getRoundResult(room.id);
      expect(result).not.toBeNull();
      expect(result!.correctIndex).toBe(1);
      expect(result!.answers).toHaveLength(2);
      expect(result!.leaderboard).toHaveLength(2);
    });

    it('should advance questions', () => {
      const { room } = engine.createRoom('socket-adv-h', 'Host', 'AdvRoom');
      engine.setReady('socket-adv-h');
      engine.startGame(room.id);

      engine.getNextQuestion(room.id);
      expect(room.currentQuestion).toBe(0);

      const hasMore = engine.advanceQuestion(room.id);
      expect(hasMore).toBe(true);
      expect(room.currentQuestion).toBe(1);
    });

    it('should finish game and produce results', () => {
      const { room } = engine.createRoom('socket-fin-h', 'Host', 'FinRoom');
      engine.joinRoom('socket-fin-j', 'Player', room.code);
      engine.setReady('socket-fin-j');
      engine.startGame(room.id);

      // Play through all questions
      for (let i = 0; i < 3; i++) {
        const q = engine.getNextQuestion(room.id);
        if (!q) break;
        engine.submitAnswer('socket-fin-h', q.id, 1, 2000);
        engine.submitAnswer('socket-fin-j', q.id, 0, 3000);
        engine.getRoundResult(room.id);
        if (i < 2) engine.advanceQuestion(room.id);
      }

      const result = engine.finishGame(room.id);
      expect(result).not.toBeNull();
      expect(result!.leaderboard).toHaveLength(2);
      expect(result!.roomId).toBe(room.id);
      expect(room.status).toBe('finished');
    });
  });

  describe('Reconnection', () => {
    it('should handle disconnect during game', () => {
      const { room } = engine.createRoom('socket-dc-h', 'DCHost', 'DCRoom');
      engine.joinRoom('socket-dc-j', 'DCPlayer', room.code);
      engine.setReady('socket-dc-j');
      engine.startGame(room.id);
      engine.getNextQuestion(room.id);

      const result = engine.handleDisconnect('socket-dc-j');
      expect(result).not.toBeNull();
      expect(result!.room.players.find((p) => p.username === 'DCPlayer')?.isConnected).toBe(false);
    });

    it('should handle reconnection', () => {
      const { room } = engine.createRoom('socket-rc-h', 'RCHost', 'RCRoom');
      const joined = engine.joinRoom('socket-rc-j', 'RCPlayer', room.code);
      if ('error' in joined) throw new Error('Join failed');

      engine.setReady('socket-rc-j');
      engine.startGame(room.id);
      engine.getNextQuestion(room.id);

      engine.handleDisconnect('socket-rc-j');

      const result = engine.handleReconnect('socket-rc-j2', joined.playerId, room.code);
      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        expect(result.room.players.find((p) => p.id === joined.playerId)?.isConnected).toBe(true);
      }
    });
  });

  describe('Room utilities', () => {
    it('should list public rooms', () => {
      engine.createRoom('socket-pub', 'PubHost', 'Public Room');
      const rooms = engine.getRooms();
      expect(rooms.length).toBeGreaterThan(0);
    });

    it('should get room by code', () => {
      const { room } = engine.createRoom('socket-bycode', 'ByCode', 'CodeRoom');
      const found = engine.getRoomByCode(room.code);
      expect(found).toBeDefined();
      expect(found?.name).toBe('CodeRoom');
    });

    it('should reset a room', () => {
      const { room } = engine.createRoom('socket-reset', 'ResetHost', 'ResetRoom');
      engine.startGame(room.id);
      engine.resetRoom(room.id);
      expect(room.status).toBe('waiting');
      expect(room.currentQuestion).toBe(0);
    });
  });
});
