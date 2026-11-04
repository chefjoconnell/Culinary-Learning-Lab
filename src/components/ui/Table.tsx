interface Props { caption: string; headers: string[]; rows: string[][] }

/** Reference table. Scrollable wrapper is focusable so keyboard users can scroll on small screens. */
export default function Table({ caption, headers, rows }: Props) {
  return (
    <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto rounded-lg border border-steel-300 dark:border-charcoal-600">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm sm:text-base">
        <caption className="bg-charcoal-800 px-4 py-3 text-left font-display text-lg font-bold text-warm-50">{caption}</caption>
        <thead className="bg-warm-200 dark:bg-charcoal-700">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-steel-300 odd:bg-white even:bg-warm-50 dark:border-charcoal-600 dark:odd:bg-charcoal-800 dark:even:bg-charcoal-900">
              {r.map((c, j) =>
                j === 0 ? <th key={j} scope="row" className="px-4 py-3 font-semibold">{c}</th> : <td key={j} className="px-4 py-3">{c}</td>,
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
