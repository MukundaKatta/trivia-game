import { motion } from 'framer-motion';
import type { LeaderboardEntry } from '@trivia/shared';

interface Props {
  entry: LeaderboardEntry | undefined;
  duration: number;
  totalQuestions: number;
}

export default function GameStats({ entry, duration, totalQuestions }: Props) {
  if (!entry) return null;

  const accuracy = entry.totalAnswers > 0
    ? Math.round((entry.correctAnswers / entry.totalAnswers) * 100)
    : 0;

  const stats = [
    { label: 'Final Score', value: entry.score.toString() },
    { label: 'Rank', value: `#${entry.rank}` },
    { label: 'Correct', value: `${entry.correctAnswers}/${totalQuestions}` },
    { label: 'Accuracy', value: `${accuracy}%` },
    { label: 'Best Streak', value: entry.streak.toString() },
    { label: 'Duration', value: `${Math.floor(duration / 60)}m ${duration % 60}s` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="card text-center p-4"
        >
          <p className="text-xl font-bold">{stat.value}</p>
          <p className="text-xs text-surface-200/50 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
