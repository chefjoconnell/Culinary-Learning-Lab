/**
 * Local practice progress. Stores ONLY lesson ids, scores and dates in this browser.
 * No names or personal information. Not an official grade record.
 */
export interface LessonResult { bestPct: number; lastPct: number; attempts: number; date: string }
export interface PracticeState {
  version: 1;
  results: Record<string, LessonResult>;
  days: string[];
  bellRingerDays: string[];
  challengeDays: string[];
  improved: boolean;
  goal: string;
}

export const STORAGE_KEY = 'rmctc-practice-v1';
export const PASS_PERCENT = 80;

export const emptyState = (): PracticeState => ({
  version: 1, results: {}, days: [], bellRingerDays: [], challengeDays: [], improved: false, goal: '',
});

export function todayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

const addDay = (list: string[], day: string) => (list.includes(day) ? list : [...list, day].sort());

export function recordResult(s: PracticeState, lessonId: string, score: number, total: number, day = todayKey()): PracticeState {
  const prev = s.results[lessonId];
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return {
    ...s,
    results: {
      ...s.results,
      [lessonId]: { bestPct: Math.max(pct, prev?.bestPct ?? 0), lastPct: pct, attempts: (prev?.attempts ?? 0) + 1, date: day },
    },
    days: addDay(s.days, day),
    improved: s.improved || (prev !== undefined && pct > prev.bestPct),
  };
}

export function recordBellRinger(s: PracticeState, day = todayKey()): PracticeState {
  return { ...s, bellRingerDays: addDay(s.bellRingerDays, day), days: addDay(s.days, day) };
}
export function recordChallenge(s: PracticeState, day = todayKey()): PracticeState {
  return { ...s, challengeDays: addDay(s.challengeDays, day), days: addDay(s.days, day) };
}

const dayNumber = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
};

/** Consecutive practice days ending today (or yesterday, so the streak isn't lost until a full day is missed). */
export function computeStreak(days: string[], today = todayKey()): number {
  const set = new Set(days.map(dayNumber));
  let cursor = dayNumber(today);
  if (!set.has(cursor)) cursor -= 1;
  let streak = 0;
  while (set.has(cursor)) { streak++; cursor--; }
  return streak;
}

export interface BadgeDef { id: string; available: boolean; earned: (s: PracticeState) => boolean }
const passed = (s: PracticeState, id: string) => {
  const r = s.results[id];
  return !!r && r.bestPct >= PASS_PERCENT;
};

export const BADGES: BadgeDef[] = [
  { id: 'mise-en-place-master', available: true, earned: (s) => s.bellRingerDays.some((d) => s.challengeDays.includes(d)) },
  { id: 'knife-skills-apprentice', available: false, earned: () => false },
  { id: 'sauce-scholar', available: true, earned: (s) => passed(s, '1-1') },
  { id: 'stock-specialist', available: true, earned: (s) => passed(s, '1-2') },
  { id: 'culinary-mathematician', available: true, earned: (s) => passed(s, '2-2') },
  { id: 'food-safety-defender', available: true, earned: (s) => passed(s, '3-2') },
  { id: 'meat-fabrication-apprentice', available: true, earned: (s) => passed(s, '3-1') },
  { id: 'bistro-professional', available: false, earned: () => false },
  { id: 'choose-hard-champion', available: true, earned: (s) => s.improved },
];

export function needsReview(s: PracticeState): string[] {
  return Object.entries(s.results).filter(([id]) => !passed(s, id)).map(([id]) => id);
}

// ---- persistence + subscription ----
let state: PracticeState = load();
const listeners = new Set<() => void>();

function load(): PracticeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.version === 1) return { ...emptyState(), ...p };
    }
  } catch { /* corrupt or unavailable */ }
  return emptyState();
}

function commit(next: PracticeState) {
  state = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export const progressStore = {
  getState: () => state,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  recordResult: (id: string, score: number, total: number) => commit(recordResult(state, id, score, total)),
  recordBellRinger: () => commit(recordBellRinger(state)),
  recordChallenge: () => commit(recordChallenge(state)),
  setGoal: (goal: string) => commit({ ...state, goal: goal.slice(0, 200) }),
  reset: () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    commit(emptyState());
  },
};
