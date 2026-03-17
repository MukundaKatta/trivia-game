import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  code: string;
}

export default function RoomCode({ code }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="card text-center">
      <p className="text-xs text-surface-200/50 mb-2 uppercase tracking-wider">Room Code</p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl font-black tracking-[0.3em] text-primary-300">
          {code}
        </span>
        <button
          onClick={copy}
          className="text-sm text-surface-200/60 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-surface-200/10"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
