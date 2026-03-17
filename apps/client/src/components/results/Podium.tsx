import { motion } from 'framer-motion';
import type { LeaderboardEntry } from '@trivia/shared';
import Avatar from '../shared/Avatar';

interface Props {
  leaderboard: LeaderboardEntry[];
  currentPlayerId: string | null;
}

const podiumHeights = ['h-28', 'h-36', 'h-24'];
const podiumColors = ['bg-gray-400/20', 'bg-yellow-500/20', 'bg-orange-600/20'];
const podiumBorders = ['border-gray-400/40', 'border-yellow-500/40', 'border-orange-600/40'];
const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

export default function Podium({ leaderboard, currentPlayerId }: Props) {
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="flex items-end justify-center gap-3 mb-8 pt-8">
      {podiumOrder.map((podiumIdx) => {
        const entry = top3[podiumIdx];
        if (!entry) return <div key={podiumIdx} className="w-28" />;

        const rankLabels = ['1st', '2nd', '3rd'];

        return (
          <motion.div
            key={entry.playerId}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: podiumIdx * 0.2, type: 'spring', bounce: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + podiumIdx * 0.2, type: 'spring' }}
            >
              <Avatar
                username={entry.username}
                color={entry.avatarColor}
                size={podiumIdx === 0 ? 'lg' : 'md'}
              />
            </motion.div>
            <p className={`font-bold text-sm mt-2 ${entry.playerId === currentPlayerId ? 'text-primary-400' : ''}`}>
              {entry.username}
            </p>
            <p className="text-xs text-surface-200/50 mb-2">{entry.score} pts</p>
            <div
              className={`w-28 ${podiumHeights[podiumIdx]} ${podiumColors[podiumIdx]} border-t-2 ${podiumBorders[podiumIdx]}
                          rounded-t-xl flex items-start justify-center pt-3`}
            >
              <span className="text-2xl font-black text-surface-200/60">
                {rankLabels[podiumIdx]}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
