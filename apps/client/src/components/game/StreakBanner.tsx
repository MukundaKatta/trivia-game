import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  streak: number;
}

export default function StreakBanner({ streak }: Props) {
  if (streak < 2) return null;

  const flames = streak >= 5 ? '!!' : streak >= 3 ? '!' : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="flex items-center justify-center gap-2 py-2"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="text-2xl"
        >
          {streak >= 5 ? '!!!' : streak >= 3 ? '!!' : '!'}
        </motion.div>
        <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          {streak} Streak{flames}
        </span>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
          className="text-2xl"
        >
          {streak >= 5 ? '!!!' : streak >= 3 ? '!!' : '!'}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
