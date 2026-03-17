import { Link } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore';

export default function Header() {
  const connected = useGameStore((s) => s.connected);

  return (
    <header className="flex items-center justify-between mb-8">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-xl font-bold
                        group-hover:bg-primary-500 transition-colors">
          ?
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
          Trivia Arena
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className="text-sm text-surface-200/60">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </header>
  );
}
