import { useId, useState, type ReactNode } from 'react';
import { useLanguage } from '../../app/store/languageContext';
import { foodCostPercent, scaleRecipe, yieldPercent } from '../../features/calculators/math';

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">{label}</label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-12 w-full rounded-lg border-2 border-steel-400 bg-white px-3 text-charcoal-900"
      />
    </div>
  );
}

function Box({ title, formula, children, result }: { title: string; formula: string; children: ReactNode; result: ReactNode }) {
  const { t } = useLanguage();
  return (
    <section className="panel space-y-3">
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-sm"><strong>{t('calc.formula')}:</strong> {formula}</p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      <div role="status" aria-live="polite" className="min-h-[3rem]">{result}</div>
    </section>
  );
}

const num = (s: string) => (s.trim() === '' ? NaN : Number(s));

function Output({ r, label, unit }: { r: ReturnType<typeof yieldPercent> | null; label: string; unit: string }) {
  const { t } = useLanguage();
  if (!r) return null;
  if (!r.ok) return <p className="font-semibold text-ember-600 dark:text-ember-400"><span aria-hidden="true">⚠ </span>{r.error === 'exceeds' ? t('calc.usableExceeds') : t('calc.invalid')}</p>;
  return (
    <div>
      <p className="text-lg font-bold">{label}: {r.value}{unit}</p>
      <p className="text-sm"><strong>{t('calc.steps')}:</strong> {r.steps.join('  →  ')}</p>
    </div>
  );
}

export default function Calculators() {
  const { t } = useLanguage();
  const [orig, setOrig] = useState('');
  const [want, setWant] = useState('');
  const [qty, setQty] = useState('');
  const [ap, setAp] = useState('');
  const [ep, setEp] = useState('');
  const [plate, setPlate] = useState('');
  const [price, setPrice] = useState('');

  const touched = (...v: string[]) => v.some((x) => x.trim() !== '');
  const scale = touched(orig, want, qty) ? scaleRecipe(num(orig), num(want), num(qty)) : null;
  const yld = touched(ap, ep) ? yieldPercent(num(ap), num(ep)) : null;
  const fc = touched(plate, price) ? foodCostPercent(num(plate), num(price)) : null;

  return (
    <div className="space-y-4">
      <p className="rounded-lg bg-saffron-400/20 p-3 font-semibold">{t('calc.preview')}</p>
      <Box title={t('calc.scale')} formula={t('calc.scaleDesc')} result={
        !scale ? null : !scale.ok ? <p className="font-semibold text-ember-600 dark:text-ember-400"><span aria-hidden="true">⚠ </span>{t('calc.invalid')}</p> : (
          <div>
            <p className="text-lg font-bold">{t('calc.factor')}: {scale.value.factor} · {t('calc.newQty')}: {scale.value.newQty}</p>
            <p className="text-sm"><strong>{t('calc.steps')}:</strong> {scale.steps.join('  →  ')}</p>
          </div>
        )}>
        <Field label={t('calc.originalYield')} value={orig} onChange={setOrig} />
        <Field label={t('calc.desiredYield')} value={want} onChange={setWant} />
        <Field label={t('calc.ingredientQty')} value={qty} onChange={setQty} />
      </Box>
      <Box title={t('calc.yield')} formula={t('calc.yieldDesc')} result={<Output r={yld} label={t('calc.yieldResult')} unit="%" />}>
        <Field label={t('calc.apWeight')} value={ap} onChange={setAp} />
        <Field label={t('calc.usableWeight')} value={ep} onChange={setEp} />
      </Box>
      <Box title={t('calc.foodCost')} formula={t('calc.foodCostDesc')} result={<Output r={fc} label={t('calc.foodCostResult')} unit="%" />}>
        <Field label={t('calc.plateCost')} value={plate} onChange={setPlate} />
        <Field label={t('calc.sellingPrice')} value={price} onChange={setPrice} />
      </Box>
    </div>
  );
}
