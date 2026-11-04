# Instructor templates

These are starting shapes. The authoritative field list is `src/data/types.ts`; copy an existing unit in `src/content/en/level*.json` if a field is unclear.

| Template | Paste into |
| --- | --- |
| `lesson.template.json` | the units list in `src/content/<lang>/level1.json`, `level2.json` or `level3.json` |
| `bell-ringer.template.json` | the bell ringer questions in `src/content/<lang>/homepage.json` |

Rules: add every change to both `en` and `es`; keep the same `id` values and the same `correct` option id in both languages; run `npm test` to confirm both languages still match.
