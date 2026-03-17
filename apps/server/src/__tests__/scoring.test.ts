import { describe, it, expect } from 'vitest';
import { calculateScore, SCORING } from '@trivia/shared';

describe('calculateScore', () => {
  it('should return 0 for incorrect answer', () => {
    expect(calculateScore(false, 5000, 15000, 0, 'easy')).toBe(0);
    expect(calculateScore(false, 1000, 15000, 5, 'hard')).toBe(0);
  });

  it('should return base points for correct answer at time limit', () => {
    const score = calculateScore(true, 15000, 15000, 0, 'easy');
    expect(score).toBe(SCORING.BASE_POINTS);
  });

  it('should give time bonus for fast answers', () => {
    const fastScore = calculateScore(true, 1000, 15000, 0, 'easy');
    const slowScore = calculateScore(true, 14000, 15000, 0, 'easy');
    expect(fastScore).toBeGreaterThan(slowScore);
  });

  it('should give max time bonus for instant answer', () => {
    const score = calculateScore(true, 0, 15000, 0, 'easy');
    expect(score).toBe(SCORING.BASE_POINTS + SCORING.TIME_BONUS_MAX);
  });

  it('should apply streak multiplier', () => {
    const noStreak = calculateScore(true, 5000, 15000, 0, 'easy');
    const withStreak = calculateScore(true, 5000, 15000, 3, 'easy');
    expect(withStreak).toBeGreaterThan(noStreak);
  });

  it('should cap streak bonus', () => {
    const streak5 = calculateScore(true, 5000, 15000, 5, 'easy');
    const streak10 = calculateScore(true, 5000, 15000, 10, 'easy');
    expect(streak5).toBe(streak10); // Both capped at MAX_STREAK_BONUS
  });

  it('should apply difficulty multiplier', () => {
    const easy = calculateScore(true, 5000, 15000, 0, 'easy');
    const medium = calculateScore(true, 5000, 15000, 0, 'medium');
    const hard = calculateScore(true, 5000, 15000, 0, 'hard');
    expect(medium).toBeGreaterThan(easy);
    expect(hard).toBeGreaterThan(medium);
    expect(hard).toBe(easy * 2);
  });

  it('should not give negative scores', () => {
    const score = calculateScore(true, 20000, 15000, 0, 'easy');
    expect(score).toBeGreaterThanOrEqual(SCORING.BASE_POINTS);
  });
});
