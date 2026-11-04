# AGENT.md

## Project Overview
This folder is a static single-page English learning web app.
It runs with plain HTML, CSS, and JavaScript (no build step, no framework, no package manager).
Meanings are shown in Vietnamese or Chinese (Simplified); the app chrome stays in English.

## Tech Stack
- `index.html`: Main app UI, inline styles, and most interaction logic.
- `i18n.js`: Learner-language layer — resolves `?lang=`, holds UI strings and grammar explanations.
- `english-words.js`: Main dictionary data (English + Vietnamese) loaded directly by the app.
- `zh-words.js`: Chinese meanings for the same word list, keyed by word (and `word|pos`).
- `sentence-quiz.js`: Sentence quiz data for the Grammar & Sentences screen.
- `The_Oxford_5000_by_CEFR_level.txt`: Source list used to regenerate dictionary data (not in the repo).
- `quiz-types.js`, `style.css`: present but not loaded by `index.html`.

## Working Scope
- Make changes inside `eng/` only unless explicitly asked otherwise.
- Preserve the app as a static browser-run project.

## Editing Guidelines
- Keep existing element IDs and class names stable; JS relies heavily on direct selectors.
- Keep script load order in `index.html` compatible with current dependencies:
  `i18n.js` (in `<head>`) → `english-words.js` → `zh-words.js` → `sentence-quiz.js` → inline scripts.
- Keep dictionary top filter row category-based (`All`, `Common`, `Greetings`, etc.).
- Show part of speech (`noun/verb/adj...`) inside each word card, not in the filter row.
- Prefer extending existing quiz/data structures instead of introducing a new architecture.
- Use UTF-8 encoding and preserve multilingual text (English/Vietnamese/Chinese).
- Keep changes incremental and testable in a browser.

## Language Rules
- `LEARNER_LANG` is resolved once at start-up in `i18n.js`: `?lang=` → `localStorage` → `vi`.
  Nothing re-translates in place; `setLearnerLang()` reloads the page.
- Never read `item.translation` from `english-words.js` unless `LEARNER_LANG === BUNDLED_DATA_LANG`
  (`'vi'`). That field is Vietnamese; using it unconditionally leaks Vietnamese into other languages.
- Meaning priority in the dictionary bridge:
  `MEANING_TABLES[lang]` → bundled `translation` (Vietnamese only) → `meaningCache` → online lookup.
- The online lookup is a last resort only. Both endpoints are unreachable from some countries, so
  every supported language should ship a complete bundled table.
- The meaning cache is namespaced per language (`engMeaningCache_v3_<lang>`). Never share one cache
  between languages.
- User-visible strings belong in `i18n.js`, reached through `t()` or a `data-i18n` attribute.
  Strings that stay English but name the language use `{language}` (see `COMMON_STRINGS`).

## Dictionary Data Rules
- Do not rely on runtime `fetch` for the Oxford `.txt` file.
- Regenerate `english-words.js` from `The_Oxford_5000_by_CEFR_level.txt` when word list updates are
  needed, then regenerate `zh-words.js` keys to match — every word needs a meaning in every language.
- Ensure each dictionary entry includes:
  - `word`, `pronunciation`, `translation`
  - `partOfSpeech`/`pos`
  - `categories` for top-row filtering
- Words that appear more than once with different parts of speech (`bat` n/v, `exit` n/v, ...) get a
  `word|pos` key in the per-language tables so each sense keeps its own meaning.
- `word` must be a single token. A row like `"trillion number troop"` means the Oxford list was
  parsed wrong and has to be split.

## Validation Checklist
After edits, verify in a browser, **in both `?lang=vi` and `?lang=zh`**:
- Sidebar navigation still switches sections correctly.
- Dictionary search and category filters still update results/counts.
- Dictionary loads non-empty data on first load, and no card shows the "no meaning yet" fallback.
- Study modes still open/close from study cards and back buttons.
- Quiz flow still works: select answer, check, next, final score.
- Sentence/grammar builder still supports select, check, clear, and next — and a correctly ordered
  sentence is actually accepted.
- Audio buttons do not throw runtime errors in the browser console.
- Layout remains usable on mobile widths.
- Compare console errors against the previous commit rather than reading them cold: the page has
  pre-existing errors (see below), so "there are errors" says nothing on its own.

## Known pre-existing issues
- `index.html` calls `initializeStudyMode()` and `setupKeyboardShortcuts()`, neither of which exists.
  The ReferenceError aborts the rest of that `DOMContentLoaded` handler; the study cards still work
  because a second handler wires them again.
- `setupDataHandlers()` adds a listener to an element that is not in the markup, throwing a
  `TypeError` inside `initializeProgress()`.
- The audio system requests `audio/<word>.mp3` files that are not in the repo; every one 404s and the
  app falls back to speech synthesis.

## Notes
`index.html` currently contains substantial inline CSS/JS. For larger refactors, prefer extracting in
small steps to avoid behavior regressions.
