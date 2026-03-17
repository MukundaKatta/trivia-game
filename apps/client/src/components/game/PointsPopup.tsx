import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  points: number;
  show: boolean;
}

export default function PointsPopup({ points, show }: Props) {
  return (
    <AnimatePresence>
      {show && points > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -30, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-50"
        >
          <div className="text-4xl font-black text-green-400 drop-shadow-lg">
            +{points}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
