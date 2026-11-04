# RMCTC Culinary Arts Learning Hub

Interactive learning site for **Reading Muhlenberg Career & Technology Center – Culinary Arts / Chef Training (CIP 12.0508)**, taught by Chef John O'Connell. It is a static site for **GitHub Pages** that links to **Canvas LMS** for all official work.

> *Choose Hard. Get 1% Better Every Day.*

**Milestone 1 includes:** the homepage "Command Center" (bell ringer, timed 5-question challenge, today's objective, assessments, Bistro news, ServSafe/NOCTI links, Canvas shortcuts), Level 1–3 dashboards, six sample units (lesson, reference table, 5-question knowledge check with explanations, exit ticket, reflection), culinary math calculators, Level 3 ServSafe scenarios, English/Spanish architecture, a local practice dashboard, a Canvas snippet and a deploy workflow.

> **Content status:** all lessons are labeled *demonstration content* and must be reviewed by the instructor before being treated as verified curriculum. The Spanish text should be reviewed by a bilingual culinary instructor. Food-safety values in Unit 3.2 follow the FDA Food Code – verify them against the edition your jurisdiction uses. Practice questions are original and are **not** actual ServSafe, NOCTI or ACF exam questions.

## Tech stack
React 18 + TypeScript, Vite, Tailwind CSS, React Router (HashRouter), Vitest. No external services or paid dependencies.

## Local development
```bash
npm install
npm run dev        # http://localhost:5173/Culinary-Learning-Lab/
npm test           # quiz, calculator, progress and EN/ES content-parity tests
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Deploying to GitHub Pages
1. Push to `main`. `.github/workflows/deploy.yml` runs the tests, builds, and publishes `dist/` to the **`gh-pages`** branch.
2. In GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch `gh-pages`, folder `/ (root)` → Save.** (Run the workflow once first so the branch exists.)
3. The site appears at `https://<user>.github.io/<repo>/`.
4. **Base path:** `vite.config.ts` defaults to `/Culinary-Learning-Lab/`; the workflow sets `VITE_BASE=/<repo-name>/` automatically. If you rename the repo, update the default (or set `VITE_BASE`).

The site uses hash URLs (`/#/level1`), so deep links and refresh work on GitHub Pages without server rewrites, and links pasted into Canvas keep working.

## Updating content (no React knowledge needed)
All text is JSON in `src/content/en/` and `src/content/es/`. Edit on GitHub (pencil icon) and commit to `main`; the site redeploys automatically. **Always make the same change in both languages.**

| To change… | Edit |
| --- | --- |
| Welcome message, today's objective/unit/skill, professionalism reminders, practical assessments, Canvas shortcuts | `homepage.json` |
| Daily bell ringer questions (one is chosen per day) | `homepage.json` → `bellRinger.questions` |
| Daily challenge (5 timed questions) | `homepage.json` → `challenge.questions` |
| Lessons, objectives, tables, quiz questions, explanations, exit tickets | `level1.json`, `level2.json`, `level3.json` → `units` |
| Bistro announcements, menu, checklist | `bistro.json` |
| Certification list and links | `certifications.json` |
| UI labels, navigation, badge text, school info, **Canvas course URL** | `common.json` |

**Example – add a bell ringer** (in `homepage.json` → `bellRinger.questions`):
```json
{
  "id": "br-new", "type": "multiple-choice",
  "stem": "Question text?",
  "options": [{"id":"a","text":"A"},{"id":"b","text":"B"},{"id":"c","text":"C"},{"id":"d","text":"D"}],
  "correct": "a",
  "explanation": "Shown after the student answers."
}
```
**Add a lesson:** copy `templates/lesson.template.json` into the `units` array of a level file (both languages) with matching `id` and `correct` values. The full shape is in `src/data/types.ts`. `npm test` fails if English and Spanish drift apart or a `correct` id does not match an option.

**AI-assisted authoring:** give the AI `src/data/types.ts` and one existing unit, ask for a single JSON object of the same shape, then review every answer and standard before publishing.

## Canvas integration
GitHub Pages is static hosting. The site **cannot** authenticate Canvas users, read grades, submit assignments, or sync grades. Official assessment stays in Canvas. No Canvas API keys or tokens are used, and none should ever be committed. Secure grade passback would require an institution-approved **LTI 1.3** integration or a server-side service.

1. **Set your course URL:** replace `https://canvas.example.edu/courses/COURSE_ID` in `src/content/en/common.json` and `src/content/es/common.json` (`canvas.baseUrl`). This powers "Back to Canvas", footer and homepage shortcuts, and each lesson's "Open in Canvas" button (`canvasPath`).
2. **Open from Canvas as an external URL:** in a Canvas Module choose **+ → External URL**, paste the Pages URL, name it, and tick **Load in a new tab**. Or paste `canvas-homepage.html` into the course front page using the HTML editor.
3. **Iframe embed (may not work):** an example is commented out in `canvas-homepage.html`. Canvas only embeds `https` pages, and many districts restrict external domains through Canvas's content security policy. If the frame is blank or refuses to connect, use the link method. Test in your own course before relying on it.

## Student practice dashboard
`/#/practice` shows streak, completed knowledge checks, recent scores, review recommendations, badges and a personal goal. Data is stored in the browser's `localStorage` (`rmctc-practice-v1`), contains only lesson ids, percentages and dates (**no names or personal information**), is **not** an official grade record, and is erased by the **Reset practice data** button. Knife Skills Apprentice and Bistro Professional badges are marked "coming soon" until their content exists.

## Accessibility checklist
- [x] Semantic landmarks, headings, lists, and tables with captions and headers
- [x] Skip link; keyboard operation (Tab, Enter/Space, arrow keys in tabs, Escape closes mobile menu)
- [x] Visible focus indicators; 48px minimum touch targets
- [x] Quiz feedback uses text and icons, not color alone; live regions announce results
- [x] Language toggle sets the page `lang`; EN/ES parity is tested
- [x] Light and dark modes; `prefers-reduced-motion` respected
- [ ] Before launch: screen-reader pass (NVDA/VoiceOver) and a contrast audit (axe/Lighthouse) on real content; add captions/transcripts for any video placed in `public/media/`; only add images you have rights to use

## File structure
```
.github/workflows/deploy.yml   GitHub Pages deployment
canvas-homepage.html           Snippet for the Canvas front page
templates/                     Instructor JSON templates
tests/                         Vitest tests
public/images, public/media    Static assets
src/app/                       App shell, language context
src/components/common/         Header, Navigation, Footer, LanguageToggle, ThemeToggle
src/components/ui/             Button, Card, ProgressBar, Tabs, Table
src/components/learning/       LessonSection, QuizQuestion, KnowledgeCheck, ExitTicket, calculators, BellRinger, DailyChallenge
src/content/{en,es}/           Instructor-editable JSON
src/data/                      Types, content loader, lesson and quiz helpers
src/features/progress/         Local practice store and hook
src/features/calculators/      Scaling, yield and food-cost math
src/pages/                     Home, Level1-3, Certifications, Bistro, About, Practice
```

## Roadmap
- **M2:** more question types (multi-select, matching, sequencing, fill-in), more calculators (plate cost, baker's %, edible-portion cost)
- **M3:** Mother Sauce Laboratory and Virtual Meat Fabrication Lab
- **M4:** more units per level, certification practice modules, terminology battles
- **M5:** accessibility audit, instructor-verified content, Restaurant Wars capstone
- **Future:** LTI 1.3 integration for secure grade passback

## License
See `LICENSE`.
