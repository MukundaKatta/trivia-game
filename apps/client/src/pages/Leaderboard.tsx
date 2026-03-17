import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchLeaderboard, type PlayerStats } from '../lib/api';
import { useSocket } from '../hooks/useSocket';
import PageWrapper from '../components/shared/PageWrapper';
import Header from '../components/shared/Header';
import Avatar from '../components/shared/Avatar';

export default function Leaderboard() {
  useSocket();
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setPlayers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <Header />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">Leaderboard</h1>
        <Link to="/" className="btn-secondary text-sm py-2 px-4">
          Back
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-surface-200/50">Loading...</div>
      ) : players.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-surface-200/50 text-lg mb-2">No players yet</p>
          <p className="text-surface-200/30">Play a game to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/profile/${player.id}`}
                className="card flex items-center gap-4 p-4 hover:bg-surface-700/50 transition-colors"
              >
                <span className={`text-lg font-bold w-8 ${
                  i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-surface-200/40'
                }`}>
                  #{i + 1}
                </span>
                <Avatar username={player.username} color={player.avatarColor} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{player.username}</p>
                  <p className="text-xs text-surface-200/50">
                    {player.gamesPlayed} games | {player.gamesWon} wins | Best streak: {player.bestStreak}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-400">{player.totalScore.toLocaleString()}</p>
                  <p className="text-xs text-surface-200/40">total score</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
