import { motion } from 'framer-motion';

interface Props {
  index: number;
  text: string;
  selected: boolean;
  disabled: boolean;
  correctIndex?: number | null;
  onClick: () => void;
}

const optionLabels = ['A', 'B', 'C', 'D'];

const optionColors = [
  'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400',
  'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400',
  'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-400',
  'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-400',
];

export default function OptionButton({ index, text, selected, disabled, correctIndex, onClick }: Props) {
  const isRevealed = correctIndex != null;
  const isCorrect = isRevealed && index === correctIndex;
  const isWrong = isRevealed && selected && index !== correctIndex;

  let classes = `bg-gradient-to-r ${optionColors[index]} border`;
  if (isCorrect) {
    classes = 'bg-green-500/30 border-green-400 ring-2 ring-green-400/50';
  } else if (isWrong) {
    classes = 'bg-red-500/30 border-red-400 ring-2 ring-red-400/50 animate-shake';
  } else if (selected) {
    classes = 'bg-primary-500/30 border-primary-400 ring-2 ring-primary-400/50';
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} rounded-xl p-4 text-left flex items-center gap-4 w-full
                  transition-all duration-200 disabled:cursor-default group`}
    >
      <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0
        ${isCorrect ? 'bg-green-500 text-white' : isWrong ? 'bg-red-500 text-white' : 'bg-surface-700 text-surface-200 group-hover:bg-surface-200/20'}`}>
        {optionLabels[index]}
      </span>
      <span className="text-base md:text-lg font-medium">{text}</span>
    </motion.button>
  );
}
