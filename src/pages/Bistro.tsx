import { useId, useState } from 'react';
import { useLanguage } from '../app/store/languageContext';
import { getContent } from '../data/content-loader';
import Table from '../components/ui/Table';

export default function Bistro() {
  const { lang } = useLanguage();
  const b = getContent<any>(lang, 'bistro');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const uid = useId();
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{b.title}</h1>
        <p className="max-w-3xl text-lg">{b.intro}</p>
      </header>
      <section aria-labelledby="ann-h">
        <h2 id="ann-h" className="mb-3 text-2xl font-bold">{b.announcementsTitle}</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {b.announcements.map((a: any) => (
            <li key={a.title} className="panel">
              <p className="text-sm font-bold text-ember-600 dark:text-saffron-400">{a.date}</p>
              <h3 className="text-xl font-bold">{a.title}</h3>
              <p>{a.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="menu-h" className="space-y-2">
        <h2 id="menu-h" className="text-2xl font-bold">{b.menuTitle}</h2>
        <Table caption={b.menuTitle} headers={b.menuHeaders} rows={b.menu.map((m: any) => [m.course, m.item, m.note])} />
        <p className="text-sm font-semibold">{b.allergenNote}</p>
      </section>
      <div className="grid gap-8 md:grid-cols-2">
        <section aria-labelledby="train-h" className="panel">
          <h2 id="train-h" className="mb-2 text-2xl font-bold">{b.trainingTitle}</h2>
          <ul className="list-disc space-y-1 pl-6">{b.training.map((t: string) => <li key={t}>{t}</li>)}</ul>
        </section>
        <section aria-labelledby="mise-h" className="panel">
          <h2 id="mise-h" className="mb-2 text-2xl font-bold">{b.mise.title}</h2>
          <ul className="space-y-1">
            {b.mise.items.map((item: string, i: number) => (
              <li key={item}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3">
                  <input type="checkbox" id={`${uid}-${i}`} checked={!!checked[item]} onChange={(e) => setChecked({ ...checked, [item]: e.target.checked })} className="h-5 w-5 accent-herb-600" />
                  <span className={checked[item] ? 'line-through' : ''}>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
