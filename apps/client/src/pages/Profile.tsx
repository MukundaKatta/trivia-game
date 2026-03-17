import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchPlayerStats, type PlayerStats } from '../lib/api';
import { ACHIEVEMENTS, type AchievementId } from '@trivia/shared';
import { useSocket } from '../hooks/useSocket';
import PageWrapper from '../components/shared/PageWrapper';
import Header from '../components/shared/Header';
import Avatar from '../components/shared/Avatar';

export default function Profile() {
  useSocket();
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;
    fetchPlayerStats(playerId)
      .then(setPlayer)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [playerId]);

  if (loading) {
    return (
      <PageWrapper>
        <Header />
        <div className="text-center py-20 text-surface-200/50">Loading...</div>
      </PageWrapper>
    );
  }

  if (!player) {
    return (
      <PageWrapper>
        <Header />
        <div className="text-center py-20">
          <p className="text-surface-200/50 text-lg mb-4">Player not found</p>
          <Link to="/leaderboard" className="btn-primary">Back to Leaderboard</Link>
        </div>
      </PageWrapper>
    );
  }

  const accuracy = player.totalAnswered > 0
    ? Math.round((player.totalCorrect / player.totalAnswered) * 100)
    : 0;
  const winRate = player.gamesPlayed > 0
    ? Math.round((player.gamesWon / player.gamesPlayed) * 100)
    : 0;

  const stats = [
    { label: 'Games Played', value: player.gamesPlayed },
    { label: 'Games Won', value: player.gamesWon },
    { label: 'Win Rate', value: `${winRate}%` },
    { label: 'Total Score', value: player.totalScore.toLocaleString() },
    { label: 'Questions Correct', value: player.totalCorrect },
    { label: 'Accuracy', value: `${accuracy}%` },
    { label: 'Best Streak', value: player.bestStreak },
    { label: 'Total Answered', value: player.totalAnswered },
  ];

  return (
    <PageWrapper>
      <Header />

      <div className="flex items-center gap-2 mb-8">
        <Link to="/leaderboard" className="text-sm text-surface-200/50 hover:text-white transition-colors">
          Leaderboard
        </Link>
        <span className="text-surface-200/30">/</span>
        <span className="text-sm">{player.username}</span>
      </div>

      {/* Profile Header */}
      <div className="card flex items-center gap-6 mb-8">
        <Avatar username={player.username} color={player.avatarColor} size="lg" />
        <div>
          <h1 className="text-2xl font-bold">{player.username}</h1>
          <p className="text-surface-200/50">{player.totalScore.toLocaleString()} total points</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card text-center p-4"
          >
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-surface-200/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <h2 className="text-lg font-bold mb-4">
        Achievements ({player.achievements.length}/{Object.keys(ACHIEVEMENTS).length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Object.values(ACHIEVEMENTS).map((ach) => {
          const unlocked = player.achievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`card flex items-center gap-3 p-4 ${unlocked ? '' : 'opacity-30'}`}
            >
              <span className="text-2xl">{ach.icon}</span>
              <div>
                <p className="font-bold text-sm">{ach.name}</p>
                <p className="text-xs text-surface-200/50">{ach.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
