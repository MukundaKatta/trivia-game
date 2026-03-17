import { motion } from 'framer-motion';
import type { QuestionPublic } from '@trivia/shared';

interface Props {
  question: QuestionPublic;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  hard: 'bg-red-500/20 text-red-300',
};

export default function QuestionCard({ question }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card text-center mb-6"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty]}`}>
          {question.difficulty}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300">
          {question.category}
        </span>
        <span className="text-sm text-surface-200/50">
          {question.questionNumber} / {question.totalQuestions}
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
        {question.question}
      </h2>
    </motion.div>
  );
}
