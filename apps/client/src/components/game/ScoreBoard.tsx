import { motion, AnimatePresence } from 'framer-motion';
import type { LeaderboardEntry } from '@trivia/shared';
import Avatar from '../shared/Avatar';

interface Props {
  leaderboard: LeaderboardEntry[];
  currentPlayerId: string | null;
}

export default function ScoreBoard({ leaderboard, currentPlayerId }: Props) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-surface-200/60 uppercase tracking-wider mb-3">Scoreboard</h3>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((entry) => (
            <motion.div
              key={entry.playerId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                entry.playerId === currentPlayerId ? 'bg-primary-500/15 ring-1 ring-primary-500/30' : ''
              }`}
            >
              <span className="text-sm font-bold text-surface-200/50 w-5">{entry.rank}</span>
              <Avatar username={entry.username} color={entry.avatarColor} size="sm" />
              <span className="flex-1 font-medium text-sm truncate">{entry.username}</span>
              <div className="text-right">
                <div className="font-bold text-sm">{entry.score}</div>
                {entry.scoreChange > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-400"
                  >
                    +{entry.scoreChange}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
