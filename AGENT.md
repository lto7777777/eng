# AGENT.md

## Project Overview
This folder is a static single-page English learning web app.
It runs with plain HTML, CSS, and JavaScript (no build step, no framework, no package manager).

## Tech Stack
- `index.html`: Main app UI, inline styles, and most interaction logic.
- `style.css`: Shared/external styling.
- `english-words.js`: Main dictionary data loaded directly by the app.
- `The_Oxford_5000_by_CEFR_level.txt`: Source list used to regenerate dictionary data.
- `sentence-quiz.js`: Sentence quiz data/logic.
- `quiz-types.js`, `word-transformer.js`: Quiz helpers/utilities.

## Working Scope
- Make changes inside `eng/` only unless explicitly asked otherwise.
- Preserve the app as a static browser-run project.

## Editing Guidelines
- Keep existing element IDs and class names stable; JS relies heavily on direct selectors.
- Keep script load order in `index.html` compatible with current dependencies.
- Keep dictionary top filter row category-based (`All`, `Common`, `Greetings`, etc.).
- Show part of speech (`noun/verb/adj...`) inside each word card, not in the filter row.
- Prefer extending existing quiz/data structures instead of introducing a new architecture.
- Use UTF-8 encoding and preserve multilingual text (English/Korean/Vietnamese).
- Keep changes incremental and testable in a browser.

## Dictionary Data Rules
- Do not rely on runtime `fetch` for the Oxford `.txt` file.
- Regenerate `english-words.js` from `The_Oxford_5000_by_CEFR_level.txt` when word list updates are needed.
- Ensure each dictionary entry includes:
  - `word`, `pronunciation`, `translation`
  - `partOfSpeech`/`pos`
  - `categories` for top-row filtering

## Validation Checklist
After edits, verify:
- Sidebar navigation still switches sections correctly.
- Dictionary search and category filters still update results/counts.
- Dictionary loads non-empty data on first load.
- Study modes still open/close from study cards and back buttons.
- Quiz flow still works: select answer, check, next, final score.
- Sentence/grammar builder still supports drag/select, check, clear, and next.
- Audio buttons do not throw runtime errors in the browser console.
- Layout remains usable on mobile widths.

## Notes
`index.html` currently contains substantial inline CSS/JS. For larger refactors, prefer extracting in small steps to avoid behavior regressions.
