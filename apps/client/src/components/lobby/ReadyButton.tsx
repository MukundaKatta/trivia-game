import { motion } from 'framer-motion';
import { getSocket } from '../../lib/socket';

interface Props {
  isReady: boolean;
  isHost: boolean;
  allReady: boolean;
  playerCount: number;
  onStart: () => void;
}

export default function ReadyButton({ isReady, isHost, allReady, playerCount, onStart }: Props) {
  const socket = getSocket();

  return (
    <div className="flex flex-col gap-3">
      {!isHost && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => socket.emit('room:ready')}
          className={`w-full font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 ${
            isReady
              ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/25'
              : 'bg-surface-700 hover:bg-surface-200/20 text-white border border-surface-200/10'
          }`}
        >
          {isReady ? 'Ready!' : 'Click to Ready Up'}
        </motion.button>
      )}
      {isHost && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          disabled={!allReady || playerCount < 1}
          className="btn-primary w-full text-lg py-4 disabled:opacity-40"
        >
          {!allReady
            ? 'Waiting for players to ready up...'
            : 'Start Game'}
        </motion.button>
      )}
    </div>
  );
}
