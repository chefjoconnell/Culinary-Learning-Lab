import { describe, expect, it } from 'vitest';
import { getAllLessons } from '../src/data/lessons';
import { dailyIndex, percent, scoreAnswers } from '../src/data/quizzes';
import { getContent } from '../src/data/content-loader';

describe('quiz scoring', () => {
  const q = getAllLessons('en')[0].lesson.knowledgeCheck;

  it('scores all-correct answers as full marks', () => {
    const answers = Object.fromEntries(q.map((x) => [x.id, x.correct]));
    expect(scoreAnswers(q, answers)).toBe(q.length);
    expect(percent(q.length, q.length)).toBe(100);
  });

  it('scores unanswered / wrong answers as zero', () => {
    expect(scoreAnswers(q, {})).toBe(0);
    expect(scoreAnswers(q, { [q[0].id]: 'zzz' })).toBe(0);
  });

  it('picks a stable daily index within range', () => {
    const d = new Date(2026, 0, 15);
    expect(dailyIndex(3, d)).toBe(dailyIndex(3, d));
    expect(dailyIndex(3, d)).toBeLessThan(3);
    expect(dailyIndex(0, d)).toBe(0);
  });
});

describe('content integrity', () => {
  for (const lang of ['en', 'es'] as const) {
    it(`${lang}: every lesson has 5 valid knowledge-check questions and key sections`, () => {
      const all = getAllLessons(lang);
      expect(all).toHaveLength(6);
      for (const { lesson } of all) {
        expect(lesson.objective).toBeTruthy();
        expect(lesson.table.rows.length).toBeGreaterThan(0);
        expect(lesson.exitTicket.prompt).toBeTruthy();
        expect(lesson.knowledgeCheck).toHaveLength(5);
        const qs = [...lesson.knowledgeCheck, ...(lesson.scenarios?.flatMap((s) => s.questions) ?? [])];
        for (const x of qs) {
          expect(x.options.map((o) => o.id)).toContain(x.correct);
          expect(x.explanation).toBeTruthy();
        }
      }
    });
  }

  it('Spanish content mirrors English structure and answer keys', () => {
    const en = getAllLessons('en');
    const es = getAllLessons('es');
    expect(es.map((x) => x.lesson.id)).toEqual(en.map((x) => x.lesson.id));
    en.forEach(({ lesson }, i) => {
      const other = es[i].lesson;
      expect(other.knowledgeCheck.map((q) => [q.id, q.correct])).toEqual(lesson.knowledgeCheck.map((q) => [q.id, q.correct]));
      expect(other.scenarios?.length).toBe(lesson.scenarios?.length);
    });
    const keys = (o: any, p = ''): string[] =>
      o && typeof o === 'object' && !Array.isArray(o) ? Object.keys(o).flatMap((k) => keys(o[k], `${p}.${k}`)) : [p];
    for (const f of ['common', 'homepage', 'bistro', 'certifications', 'about']) {
      expect(keys(getContent('es', f)).sort()).toEqual(keys(getContent('en', f)).sort());
    }
  });
});
