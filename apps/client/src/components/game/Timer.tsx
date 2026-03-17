import { motion } from 'framer-motion';

interface Props {
  timeLeft: number;
  totalTime: number;
}

export default function Timer({ timeLeft, totalTime }: Props) {
  const percentage = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft <= 5;
  const color = isUrgent ? 'rgb(239, 68, 68)' : timeLeft <= 10 ? 'rgb(234, 179, 8)' : 'rgb(99, 102, 241)';

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-3 bg-surface-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>
      <motion.span
        className={`text-2xl font-bold tabular-nums min-w-[3ch] text-right ${isUrgent ? 'text-red-400' : 'text-white'}`}
        animate={isUrgent ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        key={timeLeft}
      >
        {timeLeft}
      </motion.span>
    </div>
  );
}
