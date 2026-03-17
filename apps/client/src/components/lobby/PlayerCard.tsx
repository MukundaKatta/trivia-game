import { motion } from 'framer-motion';
import type { Player } from '@trivia/shared';
import Avatar from '../shared/Avatar';

interface Props {
  player: Player;
  isCurrentUser: boolean;
  isHost: boolean;
  onKick?: () => void;
  canKick: boolean;
}

export default function PlayerCard({ player, isCurrentUser, isHost, onKick, canKick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${
        isCurrentUser ? 'bg-primary-500/15 ring-1 ring-primary-500/30' : 'bg-surface-800/50'
      }`}
    >
      <Avatar username={player.username} color={player.avatarColor} isConnected={player.isConnected} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">{player.username}</span>
          {isCurrentUser && (
            <span className="text-[10px] bg-primary-500/30 text-primary-300 px-1.5 py-0.5 rounded">you</span>
          )}
          {player.isHost && (
            <span className="text-[10px] bg-yellow-500/30 text-yellow-300 px-1.5 py-0.5 rounded">host</span>
          )}
        </div>
        <span className={`text-xs ${player.isConnected ? (player.isReady ? 'text-green-400' : 'text-surface-200/50') : 'text-red-400'}`}>
          {!player.isConnected ? 'Disconnected' : player.isReady ? 'Ready' : 'Not ready'}
        </span>
      </div>
      {canKick && !player.isHost && (
        <button
          onClick={onKick}
          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
        >
          Kick
        </button>
      )}
    </motion.div>
  );
}
