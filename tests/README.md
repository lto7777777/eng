# Tests

End-to-end checks that drive the real app in a real browser: both meaning
languages, every study mode, the language switcher, and storage isolation.

The app itself still has **no dependencies**. Playwright is needed only to run
these tests, and nothing in `index.html` imports anything from this folder.

## Running

```
npm install playwright        # or: npm i -g playwright
npx playwright install chromium
node tests/browser-test.js
```

One language only:

```
node tests/browser-test.js zh
```

The script serves the repository itself on a free port, so there is no server to
start first. It also blocks `translate.googleapis.com` and
`api.mymemory.translated.net`, so a run never depends on the network — and a run
that passes proves the bundled meanings are complete, because any word without
one would try to fetch it.

Exit code is `0` when every check passes, `1` on a failure, `2` when Playwright
is missing.

## What it asserts

- All 2010 words load, and **no word falls back to "no meaning yet"** in either language.
- No translation API call is made in either language.
- Homonyms (`bat` n/v, `exit` n/v, ...) keep separate meanings.
- Nothing Vietnamese appears in Chinese mode.
- Dictionary search works by English word *and* by meaning; category filters narrow the list.
- Flashcards, quiz, new-words quiz and grammar all render in the selected language.
- A correctly ordered grammar sentence is actually accepted.
- `?lang=` switches, persists and is restored; an unknown value falls back without breaking.
- The meaning cache is namespaced per language.
- **The browser console is clean** — no page errors, no 4xx. Add a fix, not an exception,
  if this starts failing.
