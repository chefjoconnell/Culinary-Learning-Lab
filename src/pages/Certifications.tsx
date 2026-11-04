import { useLanguage } from '../app/store/languageContext';
import { getContent } from '../data/content-loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Certifications() {
  const { lang, t } = useLanguage();
  const c = getContent<any>(lang, 'certifications');
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">{c.title}</h1>
      <p className="max-w-3xl text-lg">{c.intro}</p>
      <p role="note" className="rounded-lg border-2 border-saffron-500 bg-saffron-400/20 p-3 text-sm font-semibold">⚠ {c.disclaimer}</p>
      <ul className="grid gap-4 md:grid-cols-2">
        {c.items.map((i: any) => (
          <li key={i.id}>
            <Card
              title={i.name}
              eyebrow={i.type}
              className="h-full"
              footer={
                <div className="flex flex-wrap gap-2">
                  {i.link && <Button to={i.link}>{t('lesson.start')}</Button>}
                  <Button href={i.url} variant="secondary">{c.visit} ↗<span className="sr-only"> ({i.name}, {t('header.newTab')})</span></Button>
                </div>
              }
            >
              <p>{i.summary}</p>
              <p className="mt-2 text-sm font-semibold">{c.status}: {i.status}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
