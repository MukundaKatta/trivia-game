import { CATEGORIES, type RoomSettings as RoomSettingsType, type Category, type Difficulty } from '@trivia/shared';
import { getSocket } from '../../lib/socket';

interface Props {
  settings: RoomSettingsType;
  isHost: boolean;
}

export default function RoomSettings({ settings, isHost }: Props) {
  const socket = getSocket();

  function update(partial: Partial<RoomSettingsType>) {
    socket.emit('room:settings', partial);
  }

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-surface-200/60 uppercase tracking-wider">Room Settings</h3>

      <div>
        <label className="text-xs text-surface-200/50 mb-1 block">Questions</label>
        <select
          className="input text-sm"
          value={settings.questionCount}
          onChange={(e) => update({ questionCount: Number(e.target.value) })}
          disabled={!isHost}
        >
          {[5, 10, 15, 20, 25].map((n) => (
            <option key={n} value={n}>{n} questions</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-surface-200/50 mb-1 block">Time per question</label>
        <select
          className="input text-sm"
          value={settings.timePerQuestion}
          onChange={(e) => update({ timePerQuestion: Number(e.target.value) })}
          disabled={!isHost}
        >
          {[10, 15, 20, 30].map((n) => (
            <option key={n} value={n}>{n} seconds</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-surface-200/50 mb-1 block">Difficulty</label>
        <select
          className="input text-sm"
          value={settings.difficulty}
          onChange={(e) => update({ difficulty: e.target.value as Difficulty | 'mixed' })}
          disabled={!isHost}
        >
          <option value="mixed">Mixed</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-surface-200/50 mb-1 block">Max Players</label>
        <select
          className="input text-sm"
          value={settings.maxPlayers}
          onChange={(e) => update({ maxPlayers: Number(e.target.value) })}
          disabled={!isHost}
        >
          {[2, 4, 6, 8].map((n) => (
            <option key={n} value={n}>{n} players</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-surface-200/50 mb-2 block">Categories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const selected = settings.categories.includes(cat);
            return (
              <button
                key={cat}
                disabled={!isHost}
                onClick={() => {
                  if (!isHost) return;
                  const newCats = selected
                    ? settings.categories.filter((c) => c !== cat)
                    : [...settings.categories, cat];
                  if (newCats.length > 0) update({ categories: newCats as Category[] });
                }}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  selected
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-700 text-surface-200/60 hover:bg-surface-200/10'
                } ${!isHost ? 'cursor-default' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
