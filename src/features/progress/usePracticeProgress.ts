import { useSyncExternalStore } from 'react';
import { BADGES, computeStreak, needsReview, progressStore } from './progressStore';

export function usePracticeProgress() {
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getState);
  return {
    state,
    streak: computeStreak(state.days),
    badges: BADGES.map((b) => ({ ...b, isEarned: b.earned(state) })),
    review: needsReview(state),
    checksCompleted: Object.keys(state.results).length,
    ...progressStore,
  };
}
