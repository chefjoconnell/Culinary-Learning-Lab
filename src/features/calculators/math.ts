export interface CalcResult<T> { ok: true; value: T; steps: string[] }
export interface CalcError { ok: false; error: 'invalid' | 'exceeds' }

const valid = (...n: number[]) => n.every((x) => Number.isFinite(x) && x > 0);
const round = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;

export function scaleRecipe(original: number, desired: number, qty: number): CalcResult<{ factor: number; newQty: number }> | CalcError {
  if (!valid(original, desired, qty)) return { ok: false, error: 'invalid' };
  const factor = desired / original;
  const newQty = qty * factor;
  return { ok: true, value: { factor: round(factor, 4), newQty: round(newQty) }, steps: [`${desired} ÷ ${original} = ${round(factor, 4)}`, `${qty} × ${round(factor, 4)} = ${round(newQty)}`] };
}

export function yieldPercent(ap: number, usable: number): CalcResult<number> | CalcError {
  if (!valid(ap, usable)) return { ok: false, error: 'invalid' };
  if (usable > ap) return { ok: false, error: 'exceeds' };
  const v = round((usable / ap) * 100, 1);
  return { ok: true, value: v, steps: [`${usable} ÷ ${ap} = ${round(usable / ap, 4)}`, `${round(usable / ap, 4)} × 100 = ${v}%`] };
}

export function foodCostPercent(plateCost: number, price: number): CalcResult<number> | CalcError {
  if (!valid(plateCost, price)) return { ok: false, error: 'invalid' };
  const v = round((plateCost / price) * 100, 1);
  return { ok: true, value: v, steps: [`$${plateCost} ÷ $${price} = ${round(plateCost / price, 4)}`, `${round(plateCost / price, 4)} × 100 = ${v}%`] };
}
