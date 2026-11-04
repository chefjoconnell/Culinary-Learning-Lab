import { describe, expect, it } from 'vitest';
import { BADGES, computeStreak, emptyState, needsReview, recordBellRinger, recordChallenge, recordResult } from '../src/features/progress/progressStore';

describe('practice progress', () => {
  it('records best/last scores and flags improvement', () => {
    let s = recordResult(emptyState(), '1-1', 3, 5, '2026-01-01');
    expect(s.results['1-1']).toMatchObject({ bestPct: 60, lastPct: 60, attempts: 1 });
    expect(s.improved).toBe(false);
    expect(needsReview(s)).toEqual(['1-1']);
    s = recordResult(s, '1-1', 5, 5, '2026-01-02');
    expect(s.results['1-1']).toMatchObject({ bestPct: 100, attempts: 2 });
    expect(s.improved).toBe(true);
    expect(needsReview(s)).toEqual([]);
  });

  it('computes streaks of consecutive days', () => {
    expect(computeStreak(['2026-01-01', '2026-01-02', '2026-01-03'], '2026-01-03')).toBe(3);
    expect(computeStreak(['2026-01-01', '2026-01-02'], '2026-01-03')).toBe(2);
    expect(computeStreak(['2026-01-01'], '2026-01-05')).toBe(0);
    expect(computeStreak(['2026-01-31', '2026-02-01'], '2026-02-01')).toBe(2);
  });

  it('awards badges from practice only', () => {
    const earned = (s: ReturnType<typeof emptyState>, id: string) => BADGES.find((b) => b.id === id)!.earned(s);
    let s = recordResult(emptyState(), '1-1', 4, 5, '2026-01-01');
    expect(earned(s, 'sauce-scholar')).toBe(true);
    expect(earned(s, 'stock-specialist')).toBe(false);
    expect(earned(s, 'mise-en-place-master')).toBe(false);
    s = recordChallenge(recordBellRinger(s, '2026-01-01'), '2026-01-01');
    expect(earned(s, 'mise-en-place-master')).toBe(true);
    expect(BADGES.filter((b) => !b.available).every((b) => !b.earned(s))).toBe(true);
  });
});
