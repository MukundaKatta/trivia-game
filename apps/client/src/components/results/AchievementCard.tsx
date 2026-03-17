import { motion } from 'framer-motion';
import { ACHIEVEMENTS, type PlayerAchievement } from '@trivia/shared';

interface Props {
  achievement: PlayerAchievement;
  index: number;
}

export default function AchievementCard({ achievement, index }: Props) {
  const def = ACHIEVEMENTS[achievement.achievementId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card flex items-center gap-4 p-4"
    >
      <div className="text-3xl">{def.icon}</div>
      <div className="flex-1">
        <p className="font-bold text-sm">{def.name}</p>
        <p className="text-xs text-surface-200/50">{def.description}</p>
      </div>
      <span className="text-xs text-surface-200/40">{achievement.username}</span>
    </motion.div>
  );
}
