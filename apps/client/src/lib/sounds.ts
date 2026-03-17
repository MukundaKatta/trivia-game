type SoundName =
  | 'correct'
  | 'wrong'
  | 'tick'
  | 'countdown'
  | 'gameStart'
  | 'gameEnd'
  | 'achievement'
  | 'join'
  | 'leave'
  | 'chat'
  | 'streak';

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!soundEnabled || !audioCtx) return;

  // Resume context if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

function playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  for (const freq of frequencies) {
    playTone(freq, duration, type, volume);
  }
}

export function playSound(name: SoundName) {
  switch (name) {
    case 'correct':
      playTone(523, 0.1, 'sine', 0.2);
      setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 80);
      setTimeout(() => playTone(784, 0.2, 'sine', 0.2), 160);
      break;
    case 'wrong':
      playTone(200, 0.15, 'sawtooth', 0.1);
      setTimeout(() => playTone(180, 0.3, 'sawtooth', 0.1), 150);
      break;
    case 'tick':
      playTone(800, 0.05, 'sine', 0.08);
      break;
    case 'countdown':
      playTone(440, 0.15, 'square', 0.1);
      break;
    case 'gameStart':
      playChord([523, 659, 784], 0.3, 'sine', 0.1);
      setTimeout(() => playChord([587, 740, 880], 0.5, 'sine', 0.1), 300);
      break;
    case 'gameEnd':
      playChord([523, 659, 784, 1047], 0.8, 'sine', 0.08);
      break;
    case 'achievement':
      playTone(784, 0.1, 'sine', 0.15);
      setTimeout(() => playTone(988, 0.1, 'sine', 0.15), 100);
      setTimeout(() => playTone(1175, 0.3, 'sine', 0.15), 200);
      break;
    case 'join':
      playTone(660, 0.1, 'sine', 0.1);
      setTimeout(() => playTone(880, 0.15, 'sine', 0.1), 100);
      break;
    case 'leave':
      playTone(440, 0.1, 'sine', 0.1);
      setTimeout(() => playTone(330, 0.15, 'sine', 0.1), 100);
      break;
    case 'chat':
      playTone(1200, 0.05, 'sine', 0.05);
      break;
    case 'streak':
      playTone(523, 0.08, 'sine', 0.12);
      setTimeout(() => playTone(659, 0.08, 'sine', 0.12), 60);
      setTimeout(() => playTone(784, 0.08, 'sine', 0.12), 120);
      setTimeout(() => playTone(1047, 0.2, 'sine', 0.15), 180);
      break;
  }
}
