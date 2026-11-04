import { describe, expect, it } from 'vitest';
import { foodCostPercent, scaleRecipe, yieldPercent } from '../src/features/calculators/math';

describe('culinary calculators (known examples)', () => {
  it('scales a recipe: 10 -> 25 portions, 4 cups -> 10 cups', () => {
    const r = scaleRecipe(10, 25, 4);
    expect(r.ok && r.value).toEqual({ factor: 2.5, newQty: 10 });
  });
  it('yield: 8 lb usable of 10 lb AP = 80%', () => {
    const r = yieldPercent(10, 8);
    expect(r.ok && r.value).toBe(80);
  });
  it('food cost: $3 plate at $12 = 25%', () => {
    const r = foodCostPercent(3, 12);
    expect(r.ok && r.value).toBe(25);
  });
  it('validates inputs', () => {
    expect(scaleRecipe(0, 5, 1)).toEqual({ ok: false, error: 'invalid' });
    expect(yieldPercent(10, 12)).toEqual({ ok: false, error: 'exceeds' });
    expect(foodCostPercent(NaN, 5)).toEqual({ ok: false, error: 'invalid' });
    expect(foodCostPercent(-1, 5)).toEqual({ ok: false, error: 'invalid' });
  });
});
