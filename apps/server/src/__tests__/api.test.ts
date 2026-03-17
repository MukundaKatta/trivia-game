import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock DB modules
vi.mock('../db/schema.js', () => ({
  getDb: vi.fn(() => ({
    pragma: vi.fn(),
    exec: vi.fn(),
    prepare: vi.fn(() => ({
      run: vi.fn(),
      get: vi.fn(() => ({ c: 200 })),
      all: vi.fn(() => []),
    })),
  })),
}));

vi.mock('../db/questions.js', () => ({
  getRandomQuestions: vi.fn(() => []),
  getQuestionById: vi.fn(),
  getQuestionCount: vi.fn(() => 200),
}));

vi.mock('../db/players.js', () => ({
  upsertPlayer: vi.fn(),
  updatePlayerStats: vi.fn(),
  getPlayerStats: vi.fn(() => null),
  getTopPlayers: vi.fn(() => [
    {
      id: 'p1',
      username: 'TestPlayer',
      avatarColor: '#EF4444',
      gamesPlayed: 5,
      gamesWon: 2,
      totalScore: 1500,
      totalCorrect: 30,
      totalAnswered: 50,
      bestStreak: 5,
      achievements: [],
    },
  ]),
}));

describe('API Routes', () => {
  let app: any;

  beforeAll(async () => {
    // Dynamically import after mocks are set
    const expressModule = await import('express');
    const express = expressModule.default;
    const { default: apiRouter } = await import('../routes/api.js');

    app = express();
    app.use('/api', apiRouter);
  });

  it('should respond to health check', async () => {
    const supertest = (await import('supertest')).default;
    const res = await supertest(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.questionCount).toBe(200);
  });

  it('should return leaderboard', async () => {
    const supertest = (await import('supertest')).default;
    const res = await supertest(app).get('/api/leaderboard');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe('TestPlayer');
  });

  it('should return 404 for unknown player', async () => {
    const supertest = (await import('supertest')).default;
    const res = await supertest(app).get('/api/players/unknown-id');
    expect(res.status).toBe(404);
  });

  it('should return rooms list', async () => {
    const supertest = (await import('supertest')).default;
    const res = await supertest(app).get('/api/rooms');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
