import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';

export default function ConnectionBanner() {
  const connected = useGameStore((s) => s.connected);

  return (
    <AnimatePresence>
      {!connected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-red-600/90 backdrop-blur-sm text-white text-center py-2 text-sm font-medium z-50"
        >
          Connection lost. Reconnecting...
        </motion.div>
      )}
    </AnimatePresence>
  );
}
