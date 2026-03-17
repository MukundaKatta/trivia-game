import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectSocket, getSocket } from '../lib/socket';
import { useGameStore } from '../stores/gameStore';
import { playSound } from '../lib/sounds';

export function useSocket() {
  const navigate = useNavigate();
  const initialized = useRef(false);
  const store = useGameStore();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const socket = connectSocket();

    socket.on('connect', () => {
      useGameStore.getState().setConnected(true);

      // Try reconnection if we have stored player data
      const { playerId } = useGameStore.getState();
      const roomCode = window.location.pathname.match(/\/(lobby|game)\/(\w+)/)?.[2];
      if (playerId && roomCode) {
        socket.emit('player:reconnect', { playerId, roomCode });
      }
    });

    socket.on('disconnect', () => {
      useGameStore.getState().setConnected(false);
    });

    socket.on('room:created', ({ room, playerId }) => {
      useGameStore.getState().setPlayerId(playerId);
      useGameStore.getState().setRoom(room);
      navigate(`/lobby/${room.code}`);
    });

    socket.on('room:joined', ({ room, playerId }) => {
      useGameStore.getState().setPlayerId(playerId);
      useGameStore.getState().setRoom(room);
      const state = useGameStore.getState();
      if (room.status === 'waiting') {
        navigate(`/lobby/${room.code}`);
      } else if (room.status === 'finished') {
        navigate(`/results/${room.code}`);
      } else {
        navigate(`/game/${room.code}`);
      }
    });

    socket.on('room:updated', ({ room }) => {
      useGameStore.getState().setRoom(room);
    });

    socket.on('room:player-joined', ({ player }) => {
      playSound('join');
    });

    socket.on('room:player-left', ({ playerId }) => {
      playSound('leave');
    });

    socket.on('room:error', ({ message }) => {
      alert(message);
    });

    socket.on('game:starting', ({ countdown }) => {
      useGameStore.getState().setCountdown(countdown);
      useGameStore.getState().resetGame();
      playSound('countdown');

      const roomCode = useGameStore.getState().room?.code;
      if (roomCode) {
        navigate(`/game/${roomCode}`);
      }
    });

    socket.on('game:question', ({ question }) => {
      useGameStore.getState().setCurrentQuestion(question);
      useGameStore.getState().setRoundResult(null);
      useGameStore.getState().resetAnswer();
      useGameStore.getState().setTimeLeft(question.timeLimit);
      useGameStore.getState().setCountdown(null);
      useGameStore.getState().setAnswerProgress(0, 0);
    });

    socket.on('game:tick', ({ timeLeft }) => {
      useGameStore.getState().setTimeLeft(timeLeft);
      if (timeLeft <= 3 && timeLeft > 0) {
        playSound('tick');
      }
    });

    socket.on('game:player-answered', ({ playerId, totalAnswered, totalPlayers }) => {
      useGameStore.getState().setAnswerProgress(totalAnswered, totalPlayers);
    });

    socket.on('game:round-result', (result) => {
      useGameStore.getState().setRoundResult(result);

      const myId = useGameStore.getState().playerId;
      const myAnswer = result.answers.find((a) => a.playerId === myId);
      if (myAnswer?.isCorrect) {
        playSound('correct');
        const myEntry = result.leaderboard.find((e) => e.playerId === myId);
        if (myEntry) {
          useGameStore.getState().setLastPointsGained(myEntry.scoreChange);
          const player = useGameStore.getState().room?.players.find((p) => p.id === myId);
          if (player && player.streak >= 3) {
            playSound('streak');
            useGameStore.getState().setCurrentStreak(player.streak);
          }
        }
      } else {
        playSound('wrong');
        useGameStore.getState().setCurrentStreak(0);
      }
    });

    socket.on('game:finished', (result) => {
      useGameStore.getState().setGameResult(result);
      playSound('gameEnd');
      const roomCode = useGameStore.getState().room?.code;
      if (roomCode) {
        navigate(`/results/${roomCode}`);
      }
    });

    socket.on('chat:message', (msg) => {
      useGameStore.getState().addMessage(msg);
      const myId = useGameStore.getState().playerId;
      if (msg.playerId !== myId) {
        playSound('chat');
      }
    });

    socket.on('achievement:unlocked', (achievement) => {
      useGameStore.getState().setNewAchievement(achievement);
      playSound('achievement');
      setTimeout(() => {
        useGameStore.getState().setNewAchievement(null);
      }, 4000);
    });

    socket.on('player:reconnected', ({ playerId }) => {
      // Another player reconnected
    });

    socket.on('player:disconnected', ({ playerId }) => {
      // A player disconnected
    });

    return () => {
      // Don't disconnect on unmount - we want persistent connection
    };
  }, [navigate]);

  return getSocket();
}
