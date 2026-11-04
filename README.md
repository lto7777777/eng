# Blebleble

An English vocabulary learning web app with meanings in **Vietnamese** or **Chinese (Simplified)**.
Browse the Oxford 5000 dictionary, study with flashcards, practice with quizzes, and build
sentences with grammar exercises.

**Live demo:** https://lto7777777.github.io/eng/

- Vietnamese: https://lto7777777.github.io/eng/?lang=vi
- Chinese: https://lto7777777.github.io/eng/?lang=zh

---

## Features

- **Dictionary** — 2010 English words with meanings, pronunciation, and category filters
- **Flashcards** — flip-card practice (meaning → English)
- **Quiz** — multiple-choice questions on word meanings
- **New Words Quiz** — focused review of words you have not studied yet
- **Grammar & Sentences** — sentence construction with word-by-word explanations

## Languages

The app chrome stays in English — it is an English learning app. What switches is the
**meaning language**: dictionary glosses, flashcard prompts, quiz questions, grammar
explanations and sentence breakdowns.

Pick it from the sidebar or in Settings. The choice is remembered in the browser, and
`?lang=vi` / `?lang=zh` in the URL overrides it, so you can hand someone a link that
opens straight into their language.

Both languages ship complete and offline. The app only calls a translation API when a
word has no bundled meaning, which with the current word list never happens for Chinese —
worth knowing if the app is used somewhere `translate.googleapis.com` is unreachable.

## How to use

**Option 1 — Local:** Download or clone the repo, then open `index.html` in any browser.
No server or install needed, and it works with no internet connection.

**Option 2 — Online:** Visit the live demo link above.

## Tech stack

- Vanilla HTML, CSS, JavaScript
- No frameworks, no build tools, no dependencies
- Works offline after first load

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The whole UI and most of the logic |
| `i18n.js` | Language resolution (`?lang=`), UI strings, grammar explanations |
| `english-words.js` | Word list with Vietnamese meanings |
| `zh-words.js` | Chinese meanings for the same word list |
| `sentence-quiz.js` | Grammar sentence bank, per language |
| `tests/` | Browser checks (Playwright). Not needed to use the app. |

## Tests

```
npm install playwright && npx playwright install chromium
node tests/browser-test.js
```

71 checks across both languages: every study mode, the switcher, storage isolation,
and a clean browser console. See `tests/README.md`.

## Adding another language

1. Add an entry to `LEARNER_LANGS` in `i18n.js` (labels, `apiCode`, UI strings, grammar text).
2. Add a `word -> meaning` file like `zh-words.js` and register it in `MEANING_TABLES`
   inside `index.html`.
3. Add the language to `translations` / `wordExplanationsByLang` in `sentence-quiz.js`.
