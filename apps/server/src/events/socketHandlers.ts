import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import type { ClientEvents, ServerEvents, ChatMessage, RoomSettings } from '@trivia/shared';
import * as engine from '../services/GameEngine.js';

type TypedSocket = Socket<ClientEvents, ServerEvents>;
type TypedServer = Server<ClientEvents, ServerEvents>;

export function registerSocketHandlers(io: TypedServer) {
  io.on('connection', (socket: TypedSocket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // --------- Room Events ---------
    socket.on('room:create', ({ username, roomName, settings }) => {
      const { room, playerId } = engine.createRoom(socket.id, username, roomName, settings);
      socket.join(room.id);
      socket.emit('room:created', { room, playerId });
    });

    socket.on('room:join', ({ username, roomCode }) => {
      const result = engine.joinRoom(socket.id, username, roomCode);
      if ('error' in result) {
        socket.emit('room:error', { message: result.error });
        return;
      }
      socket.join(result.room.id);
      socket.emit('room:joined', { room: result.room, playerId: result.playerId });
      socket.to(result.room.id).emit('room:player-joined', { player: result.player });
      socket.to(result.room.id).emit('room:updated', { room: result.room });
    });

    socket.on('room:leave', () => {
      const result = engine.leaveRoom(socket.id);
      if (!result) return;
      socket.leave(result.room.id);
      io.to(result.room.id).emit('room:player-left', { playerId: result.playerId });
      io.to(result.room.id).emit('room:updated', { room: result.room });
    });

    socket.on('room:ready', () => {
      const room = engine.setReady(socket.id);
      if (room) io.to(room.id).emit('room:updated', { room });
    });

    socket.on('room:settings', (settings: Partial<RoomSettings>) => {
      const room = engine.updateSettings(socket.id, settings);
      if (room) io.to(room.id).emit('room:updated', { room });
    });

    socket.on('room:kick', ({ playerId }) => {
      const result = engine.kickPlayer(socket.id, playerId);
      if (!result) return;
      const kickedSocket = io.sockets.sockets.get(result.kickedSocketId);
      if (kickedSocket) {
        kickedSocket.leave(result.room.id);
        kickedSocket.emit('room:error', { message: 'You were kicked from the room' });
      }
      io.to(result.room.id).emit('room:player-left', { playerId });
      io.to(result.room.id).emit('room:updated', { room: result.room });
    });

    // --------- Game Events ---------
    socket.on('game:start', () => {
      const check = engine.canStartGame(socket.id);
      if (!check.ok) {
        socket.emit('room:error', { message: check.error || 'Cannot start game' });
        return;
      }

      const state = engine.getRoomForSocket(socket.id);
      if (!state) return;
      const roomId = state.room.id;

      const questions = engine.startGame(roomId);
      if (!questions || questions.length === 0) {
        socket.emit('room:error', { message: 'No questions available. Run db:seed first.' });
        return;
      }

      // Countdown
      io.to(roomId).emit('game:starting', { countdown: 3 });

      setTimeout(() => {
        sendNextQuestion(io, roomId);
      }, 3500);
    });

    socket.on('game:answer', ({ questionId, selectedIndex, timeMs }) => {
      const state = engine.getRoomForSocket(socket.id);
      if (!state) return;
      const roomId = state.room.id;

      const answer = engine.submitAnswer(socket.id, questionId, selectedIndex, timeMs);
      if (!answer) return;

      const answered = engine.getAnsweredCount(roomId);
      const totalPlayers = state.room.players.filter((p) => p.isConnected).length;

      io.to(roomId).emit('game:player-answered', {
        playerId: answer.playerId,
        totalAnswered: answered,
        totalPlayers,
      });

      // If everyone answered, end round early
      if (engine.allPlayersAnswered(roomId)) {
        engine.clearRoomTimer(roomId);
        endRound(io, roomId);
      }
    });

    // --------- Chat Events ---------
    socket.on('chat:message', ({ message }) => {
      const state = engine.getRoomForSocket(socket.id);
      if (!state) return;
      const player = engine.getPlayerForSocket(socket.id);
      if (!player) return;

      engine.trackChatMessage(state.room.id, player.id);

      const chatMsg: ChatMessage = {
        id: uuid(),
        roomId: state.room.id,
        playerId: player.id,
        username: player.username,
        avatarColor: player.avatarColor,
        message: message.slice(0, 200),
        timestamp: new Date().toISOString(),
      };

      io.to(state.room.id).emit('chat:message', chatMsg);
    });

    // --------- Reconnection ---------
    socket.on('player:reconnect', ({ playerId, roomCode }) => {
      const result = engine.handleReconnect(socket.id, playerId, roomCode);
      if ('error' in result) {
        socket.emit('room:error', { message: result.error });
        return;
      }
      socket.join(result.room.id);
      socket.emit('room:joined', { room: result.room, playerId });
      socket.to(result.room.id).emit('player:reconnected', { playerId });
    });

    // --------- Disconnect ---------
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      const result = engine.handleDisconnect(socket.id);
      if (result) {
        io.to(result.room.id).emit('player:disconnected', { playerId: result.playerId });
        io.to(result.room.id).emit('room:updated', { room: result.room });
      }
    });
  });
}

// ---------- Game Flow Helpers ----------

function sendNextQuestion(io: TypedServer, roomId: string) {
  const question = engine.getNextQuestion(roomId);
  if (!question) {
    const result = engine.finishGame(roomId);
    if (result) io.to(roomId).emit('game:finished', result);
    return;
  }

  io.to(roomId).emit('game:question', { question });

  // Start timer
  let timeLeft = question.timeLimit;
  const interval = setInterval(() => {
    timeLeft--;
    if (timeLeft >= 0) {
      io.to(roomId).emit('game:tick', { timeLeft });
    }
    if (timeLeft <= 0) {
      clearInterval(interval);
      endRound(io, roomId);
    }
  }, 1000);

  // Store timer so we can clear it if all players answer
  engine.setRoomTimer(roomId, interval as unknown as NodeJS.Timeout);
}

function endRound(io: TypedServer, roomId: string) {
  const roundResult = engine.getRoundResult(roomId);
  if (!roundResult) return;

  io.to(roomId).emit('game:round-result', roundResult);

  // Advance after a delay
  setTimeout(() => {
    const hasMore = engine.advanceQuestion(roomId);
    if (hasMore) {
      sendNextQuestion(io, roomId);
    } else {
      const result = engine.finishGame(roomId);
      if (result) io.to(roomId).emit('game:finished', result);
    }
  }, 4000);
}
