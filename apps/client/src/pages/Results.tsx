import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useGameStore } from '../stores/gameStore';
import PageWrapper from '../components/shared/PageWrapper';
import Header from '../components/shared/Header';
import ConnectionBanner from '../components/shared/ConnectionBanner';
import Podium from '../components/results/Podium';
import AchievementCard from '../components/results/AchievementCard';
import GameStats from '../components/results/GameStats';

export default function Results() {
  useSocket();
  const navigate = useNavigate();
  const gameResult = useGameStore((s) => s.gameResult);
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  useEffect(() => {
    if (!gameResult && !room) {
      navigate('/');
    }
  }, [gameResult, room, navigate]);

  if (!gameResult) {
    return (
      <PageWrapper>
        <Header />
        <div className="text-center py-20">
          <p className="text-surface-200/50">Loading results...</p>
        </div>
      </PageWrapper>
    );
  }

  const myEntry = gameResult.leaderboard.find((e) => e.playerId === playerId);
  const totalQuestions = room?.settings.questionCount || 10;

  function handlePlayAgain() {
    useGameStore.getState().resetGame();
    if (room) {
      navigate(`/lobby/${room.code}`);
    } else {
      navigate('/');
    }
  }

  return (
    <PageWrapper>
      <ConnectionBanner />
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-extrabold mb-2">
          {myEntry?.rank === 1 ? (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Victory!
            </span>
          ) : (
            'Game Over'
          )}
        </h1>
        <p className="text-surface-200/50">
          {room?.name || 'Game'} - {totalQuestions} questions
        </p>
      </motion.div>

      {/* Podium */}
      <Podium leaderboard={gameResult.leaderboard} currentPlayerId={playerId} />

      {/* My Stats */}
      <GameStats entry={myEntry} duration={gameResult.duration} totalQuestions={totalQuestions} />

      {/* Achievements */}
      {gameResult.achievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-surface-200/60 uppercase tracking-wider mb-3">
            Achievements Unlocked
          </h3>
          <div className="grid gap-2">
            {gameResult.achievements.map((a, i) => (
              <AchievementCard key={`${a.achievementId}-${a.playerId}`} achievement={a} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      {gameResult.leaderboard.length > 3 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-surface-200/60 uppercase tracking-wider mb-3">
            Full Results
          </h3>
          <div className="space-y-2">
            {gameResult.leaderboard.map((entry) => (
              <div
                key={entry.playerId}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  entry.playerId === playerId ? 'bg-primary-500/15' : ''
                }`}
              >
                <span className="text-sm font-bold text-surface-200/50 w-6">#{entry.rank}</span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: entry.avatarColor }}
                >
                  {entry.username[0]}
                </div>
                <span className="flex-1 font-medium text-sm">{entry.username}</span>
                <div className="text-right text-sm">
                  <span className="font-bold">{entry.score}</span>
                  <span className="text-surface-200/40 ml-2">
                    {entry.correctAnswers}/{entry.totalAnswers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handlePlayAgain} className="btn-primary flex-1 text-lg py-4">
          Play Again
        </button>
        <Link to="/" className="btn-secondary flex-1 text-lg py-4 text-center">
          Home
        </Link>
      </div>
    </PageWrapper>
  );
}
