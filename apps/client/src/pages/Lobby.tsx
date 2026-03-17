import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useGameStore } from '../stores/gameStore';
import PageWrapper from '../components/shared/PageWrapper';
import Header from '../components/shared/Header';
import ConnectionBanner from '../components/shared/ConnectionBanner';
import PlayerCard from '../components/lobby/PlayerCard';
import RoomSettings from '../components/lobby/RoomSettings';
import ChatBox from '../components/lobby/ChatBox';
import RoomCode from '../components/lobby/RoomCode';
import ReadyButton from '../components/lobby/ReadyButton';

export default function Lobby() {
  const socket = useSocket();
  const navigate = useNavigate();
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  useEffect(() => {
    if (!room) {
      navigate('/');
    }
  }, [room, navigate]);

  if (!room) return null;

  const currentPlayer = room.players.find((p) => p.id === playerId);
  const isHost = currentPlayer?.isHost ?? false;
  const allReady = room.players.every((p) => p.isReady);

  function handleLeave() {
    socket.emit('room:leave');
    useGameStore.getState().resetAll();
    navigate('/');
  }

  function handleStart() {
    socket.emit('game:start');
  }

  function handleKick(targetId: string) {
    socket.emit('room:kick', { playerId: targetId });
  }

  return (
    <PageWrapper>
      <ConnectionBanner />
      <Header />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{room.name}</h2>
        <button onClick={handleLeave} className="text-sm text-red-400 hover:text-red-300 transition-colors">
          Leave Room
        </button>
      </div>

      <RoomCode code={room.code} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-6">
          {/* Players */}
          <div className="card">
            <h3 className="text-sm font-semibold text-surface-200/60 uppercase tracking-wider mb-3">
              Players ({room.players.length}/{room.settings.maxPlayers})
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {room.players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isCurrentUser={player.id === playerId}
                    isHost={player.isHost}
                    canKick={isHost && player.id !== playerId}
                    onKick={() => handleKick(player.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <ReadyButton
            isReady={currentPlayer?.isReady ?? false}
            isHost={isHost}
            allReady={allReady}
            playerCount={room.players.length}
            onStart={handleStart}
          />
        </div>

        <div className="space-y-6">
          <RoomSettings settings={room.settings} isHost={isHost} />
          <ChatBox />
        </div>
      </div>
    </PageWrapper>
  );
}
