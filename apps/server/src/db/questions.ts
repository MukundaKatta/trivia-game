import { getDb } from './schema.js';
import type { Question, Category, Difficulty } from '@trivia/shared';

interface QuestionRow {
  id: string;
  category: string;
  difficulty: string;
  question: string;
  options: string;
  correct_index: number;
  time_limit: number;
}

function rowToQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    category: row.category as Category,
    difficulty: row.difficulty as Difficulty,
    question: row.question,
    options: JSON.parse(row.options),
    correctIndex: row.correct_index,
    timeLimit: row.time_limit,
  };
}

export function getRandomQuestions(
  count: number,
  categories: Category[],
  difficulty: Difficulty | 'mixed'
): Question[] {
  const db = getDb();
  const placeholders = categories.map(() => '?').join(',');

  let query: string;
  let params: (string | number)[];

  if (difficulty === 'mixed') {
    query = `SELECT * FROM questions WHERE category IN (${placeholders}) ORDER BY RANDOM() LIMIT ?`;
    params = [...categories, count];
  } else {
    query = `SELECT * FROM questions WHERE category IN (${placeholders}) AND difficulty = ? ORDER BY RANDOM() LIMIT ?`;
    params = [...categories, difficulty, count];
  }

  const rows = db.prepare(query).all(...params) as QuestionRow[];
  return rows.map(rowToQuestion);
}

export function getQuestionById(id: string): Question | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as QuestionRow | undefined;
  return row ? rowToQuestion(row) : null;
}

export function getQuestionCount(): number {
  const db = getDb();
  const result = db.prepare('SELECT COUNT(*) as c FROM questions').get() as { c: number };
  return result.c;
}
