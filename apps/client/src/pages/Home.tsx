import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useGameStore } from '../stores/gameStore';
import { fetchRooms, fetchHealth } from '../lib/api';
import PageWrapper from '../components/shared/PageWrapper';
import Header from '../components/shared/Header';
import ConnectionBanner from '../components/shared/ConnectionBanner';

export default function Home() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { username, setUsername } = useGameStore();

  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [publicRooms, setPublicRooms] = useState<any[]>([]);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    fetchHealth().then((h) => setQuestionCount(h.questionCount)).catch(() => {});
    fetchRooms().then(setPublicRooms).catch(() => {});
    const interval = setInterval(() => {
      fetchRooms().then(setPublicRooms).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function createRoom() {
    if (!username.trim()) return;
    socket.emit('room:create', {
      username: username.trim(),
      roomName: roomName.trim() || `${username}'s Room`,
    });
  }

  function joinRoom(code?: string) {
    if (!username.trim()) return;
    const c = code || roomCode.trim().toUpperCase();
    if (!c) return;
    socket.emit('room:join', { username: username.trim(), roomCode: c });
  }

  return (
    <PageWrapper>
      <ConnectionBanner />
      <Header />

      <div className="flex flex-col items-center text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold mb-4"
        >
          <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Trivia Arena
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-surface-200/60 text-lg max-w-md"
        >
          Challenge your friends in real-time multiplayer trivia.
          {questionCount > 0 && <span className="block text-sm mt-1">{questionCount} questions across 8 categories</span>}
        </motion.p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Username input - always visible */}
        <div className="mb-6">
          <label className="text-xs text-surface-200/50 mb-1 block">Your Name</label>
          <input
            className="input text-center text-lg font-semibold"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
          />
        </div>

        <AnimatePresence mode="wait">
          {mode === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <button
                onClick={() => setMode('create')}
                className="btn-primary w-full text-lg py-4"
                disabled={!username.trim()}
              >
                Create Room
              </button>
              <button
                onClick={() => setMode('join')}
                className="btn-secondary w-full text-lg py-4"
                disabled={!username.trim()}
              >
                Join Room
              </button>
              <Link to="/leaderboard" className="btn-secondary w-full text-lg py-4 block text-center">
                Leaderboard
              </Link>
            </motion.div>
          )}

          {mode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <input
                className="input"
                placeholder="Room name (optional)"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={30}
              />
              <button onClick={createRoom} className="btn-primary w-full text-lg py-4">
                Create & Enter Lobby
              </button>
              <button onClick={() => setMode('menu')} className="btn-secondary w-full">
                Back
              </button>
            </motion.div>
          )}

          {mode === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <input
                className="input text-center text-2xl tracking-[0.3em] uppercase font-bold"
                placeholder="ROOM CODE"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button
                onClick={() => joinRoom()}
                className="btn-primary w-full text-lg py-4"
                disabled={roomCode.length < 4}
              >
                Join Room
              </button>

              {publicRooms.length > 0 && (
                <div>
                  <p className="text-xs text-surface-200/50 mb-2 uppercase tracking-wider">Public Rooms</p>
                  <div className="space-y-2">
                    {publicRooms.map((room: any) => (
                      <button
                        key={room.id}
                        onClick={() => joinRoom(room.code)}
                        className="w-full card p-3 flex items-center justify-between hover:bg-surface-700/50 transition-colors"
                      >
                        <div className="text-left">
                          <p className="font-semibold text-sm">{room.name}</p>
                          <p className="text-xs text-surface-200/50">
                            {room.players.length}/{room.settings.maxPlayers} players
                          </p>
                        </div>
                        <span className="text-xs font-mono text-primary-400">{room.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setMode('menu')} className="btn-secondary w-full">
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
