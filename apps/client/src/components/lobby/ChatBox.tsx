import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../../lib/socket';
import { useGameStore } from '../../stores/gameStore';
import Avatar from '../shared/Avatar';

export default function ChatBox() {
  const [text, setText] = useState('');
  const messages = useGameStore((s) => s.messages);
  const playerId = useGameStore((s) => s.playerId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    socket.emit('chat:message', { message: trimmed });
    setText('');
  }

  return (
    <div className="card flex flex-col h-64">
      <h3 className="text-sm font-semibold text-surface-200/60 uppercase tracking-wider mb-2">Chat</h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.length === 0 && (
          <p className="text-xs text-surface-200/30 text-center py-4">No messages yet</p>
        )}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2 ${msg.playerId === playerId ? 'flex-row-reverse' : ''}`}
            >
              <Avatar username={msg.username} color={msg.avatarColor} size="sm" />
              <div className={`max-w-[75%] ${msg.playerId === playerId ? 'text-right' : ''}`}>
                <span className="text-[10px] text-surface-200/40">{msg.username}</span>
                <div className={`text-sm px-3 py-1.5 rounded-xl ${
                  msg.playerId === playerId
                    ? 'bg-primary-600/40 rounded-tr-sm'
                    : 'bg-surface-700 rounded-tl-sm'
                }`}>
                  {msg.message}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="flex gap-2"
      >
        <input
          className="input text-sm py-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
        />
        <button type="submit" className="btn-primary py-2 px-4 text-sm">
          Send
        </button>
      </form>
    </div>
  );
}
