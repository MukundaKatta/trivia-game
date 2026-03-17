import { Router } from 'express';
import * as engine from '../services/GameEngine.js';
import { getTopPlayers, getPlayerStats } from '../db/players.js';
import { getQuestionCount } from '../db/questions.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', questionCount: getQuestionCount() });
});

router.get('/rooms', (_req, res) => {
  const rooms = engine.getRooms();
  res.json(rooms);
});

router.get('/rooms/:code', (req, res) => {
  const room = engine.getRoomByCode(req.params.code);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json(room);
});

router.get('/leaderboard', (_req, res) => {
  const players = getTopPlayers(20);
  res.json(players);
});

router.get('/players/:id', (req, res) => {
  const stats = getPlayerStats(req.params.id);
  if (!stats) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  res.json(stats);
});

export default router;
