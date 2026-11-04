#!/usr/bin/env node
//
// End-to-end checks for Blebleble, run against a real browser.
//
//   node tests/browser-test.js            both languages
//   node tests/browser-test.js zh         one language
//
// Playwright is the only requirement and it is NOT needed to use the app - the
// app itself has no dependencies. See tests/README.md.
//
// The script serves the repository root itself, so there is no server to start
// first, and it blocks the online translation endpoints so a run never depends
// on the network.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// Google Fonts is answered with an empty stylesheet rather than blocked, so the
// page renders with system fonts (the offline case) without logging a load error.
const FONTS = /fonts\.googleapis\.com|fonts\.gstatic\.com/;
const TRANSLATION_API = /translate\.googleapis\.com|mymemory\.translated\.net/;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function serve() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    // keep the server inside the repo
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, body) => {
      if (err) { res.writeHead(404).end('not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

let failures = 0;
let checks = 0;
function check(name, ok, detail) {
  checks++;
  if (!ok) failures++;
  const line = `${ok ? 'PASS' : 'FAIL'}  ${name}`;
  console.log(detail === undefined ? line : `${line}  -> ${JSON.stringify(detail)}`);
}
const hasCJK = s => /[一-鿿]/.test(s || '');
// Vietnamese uses precomposed characters spread across Latin-1 Supplement,
// Latin Extended-A/B and Latin Extended Additional. Matching a hand-written list
// of letters misses things like "ấ", so match the ranges instead.
const hasVietnamese = s => /[\u00C0-\u024F\u1EA0-\u1EF9]/.test(s || '');

async function newPage(browser, { recordApi = false } = {}) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  const apiCalls = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
  await page.route('**/*', route => {
    const url = route.request().url();
    if (FONTS.test(url)) {
      return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    }
    if (TRANSLATION_API.test(url)) {
      if (recordApi) apiCalls.push(url);
      return route.abort();
    }
    return route.continue();
  });
  return { ctx, page, errors, apiCalls };
}

async function testLanguage(browser, base, lang) {
  console.log(`\n=== lang=${lang} ===`);
  const { ctx, page, errors, apiCalls } = await newPage(browser, { recordApi: true });
  await page.goto(`${base}/index.html?lang=${lang}`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  check('html lang is set', await page.getAttribute('html', 'lang') === (lang === 'zh' ? 'zh-CN' : 'vi'));
  check('whole dictionary loaded', await page.textContent('#total-words') === '2010');
  check('all cards rendered', await page.textContent('#word-count') === '2010');

  // every word must have a meaning in this language - no card may show the fallback
  const missing = await page.evaluate(() => Array.from(document.querySelectorAll('.word-card'))
    .filter(c => (c.querySelector('.translation').textContent || '').startsWith(MEANING_FALLBACK))
    .map(c => c.querySelector('.korean').textContent));
  check('no word is missing a meaning', missing.length === 0, missing.slice(0, 10));

  // bundled meanings mean no network lookups are needed at all
  check('no translation API calls', apiCalls.length === 0, apiCalls.slice(0, 3));

  const glosses = await page.evaluate(() => {
    const want = ['absorb', 'bat', 'trillion', 'troop'];
    const out = {};
    document.querySelectorAll('.word-card').forEach(c => {
      const w = c.querySelector('.korean').textContent;
      if (want.includes(w)) (out[w] = out[w] || []).push(c.querySelector('.translation').textContent);
    });
    return out;
  });
  check('both homonym senses of "bat" are listed', glosses.bat && glosses.bat.length === 2, glosses.bat);
  check('"trillion number troop" was split into two words',
    !!(glosses.trillion && glosses.troop), [glosses.trillion, glosses.troop]);

  if (lang === 'zh') {
    check('glosses are Chinese', hasCJK(glosses.absorb[0]) && glosses.bat.every(hasCJK), glosses.absorb);
    const leaked = await page.evaluate(() => Array.from(document.querySelectorAll('.word-card .translation'))
      .map(e => e.textContent)
      .filter(t => /[\u00C0-\u024F\u1EA0-\u1EF9]/.test(t)));
    check('no Vietnamese leaked into Chinese mode', leaked.length === 0, leaked.slice(0, 5));
  } else {
    check('glosses are Vietnamese', hasVietnamese(glosses.absorb[0]), glosses.absorb);
  }

  check('search placeholder names the language',
    (await page.getAttribute('.search-input', 'placeholder')).includes(lang === 'zh' ? 'Chinese' : 'Vietnamese'));

  const picker = await page.$$eval('#learner-lang-sidebar option', o => o.map(x => x.value + (x.selected ? '*' : '')));
  check('sidebar picker shows both languages with the current one selected',
    picker.length === 2 && picker.includes(lang + '*'), picker);
  check('settings picker is present', (await page.$$('#learner-lang-settings option')).length === 2);
  check('share links are listed', (await page.$$eval('#lang-share-links a', a => a.length)) === 2);

  const blurbs = await page.$$eval('.study-card p', p => p.map(e => e.textContent.trim()));
  check('study cards describe themselves in the right language',
    lang === 'zh' ? blurbs.every(hasCJK) : blurbs.some(hasVietnamese), blurbs);

  // search by meaning, by English word, and category filter
  await page.fill('.search-input', lang === 'zh' ? '蝙蝠' : 'con dơi');
  await page.waitForTimeout(500);
  check('search by meaning finds the word',
    (await page.$$eval('.word-card .korean', e => e.map(x => x.textContent))).includes('bat'));
  await page.fill('.search-input', 'absorb');
  await page.waitForTimeout(400);
  check('search by English word works', Number(await page.textContent('#word-count')) >= 1);
  await page.fill('.search-input', '');
  await page.click('.filter[data-category="Verbs"]');
  await page.waitForTimeout(600);
  const verbs = Number(await page.textContent('#word-count'));
  check('category filter narrows the list', verbs > 100 && verbs < 2010, verbs);
  await page.click('.filter[data-category="All"]');

  // flashcards
  await page.click('.nav-item[data-section="study"]');
  await page.click('#flashcards-option');
  await page.waitForTimeout(400);
  const front = await page.textContent('#flashcard-front-word');
  check('flashcard front shows the meaning', lang === 'zh' ? hasCJK(front) : !!front, front);
  await page.click('#flip-btn');
  await page.waitForTimeout(200);
  check('flashcard back shows the English word', /^[a-zA-Z' -]+$/.test(await page.textContent('#flashcard-back-word')));
  await page.click('#back-to-study');

  // quiz
  await page.click('#quiz-option');
  await page.waitForTimeout(400);
  const q = await page.textContent('#question-text');
  check('quiz asks in the right language', lang === 'zh' ? hasCJK(q) : hasVietnamese(q), q.replace(/\n/g, ' | '));
  check('quiz offers four answers', (await page.$$('#answers-container .answer-option')).length === 4);
  await page.click('#answers-container .answer-option');
  await page.click('#check-answer-btn');
  await page.waitForTimeout(300);
  check('quiz gives feedback', (await page.textContent('#quiz-feedback')).length > 0);
  await page.click('#back-from-quiz');

  // new words quiz
  await page.click('#new-words-quiz-option');
  await page.waitForTimeout(400);
  check('new-words quiz asks in the right language',
    lang === 'zh' ? hasCJK(await page.textContent('#new-words-question-text'))
                  : hasVietnamese(await page.textContent('#new-words-question-text')));
  check('new-words quiz hint is in the right language',
    lang === 'zh' ? hasCJK(await page.textContent('#new-words-question-hint'))
                  : hasVietnamese(await page.textContent('#new-words-question-hint')));
  await page.click('#back-from-new-words-quiz');
  await page.waitForTimeout(200);

  // grammar: topic list, explanation, and a correctly built sentence being accepted
  await (await page.$('.study-card:has-text("Grammar")')).click();
  await page.waitForTimeout(400);
  check('grammar topics are listed', (await page.$$('.grammar-topic-btn')).length === 5);
  await page.click('.grammar-topic-btn[data-topic="Present Tense"]');
  await page.waitForTimeout(300);
  const explanation = await page.textContent('#grammar-content');
  check('grammar explanation is in the right language',
    lang === 'zh' ? hasCJK(explanation) : hasVietnamese(explanation), explanation.slice(0, 60));

  const answer = await page.evaluate(() => {
    const prompt = document.getElementById('sentence-prompt').textContent.trim();
    const row = sentenceQuizBank.find(r => r.prompt === prompt);
    return row ? row.correct : null;
  });
  check('the shown prompt matches a sentence row', !!answer, answer);
  for (const word of answer.replace(/[?.!]+$/, '').split(' ')) {
    await page.evaluate(token => {
      const tile = Array.from(document.querySelectorAll('#word-bank .word-item'))
        .find(e => e.textContent === token && e.style.visibility !== 'hidden');
      if (tile) tile.click();
    }, word);
  }
  await page.click('#check-sentence-btn');
  await page.waitForTimeout(300);
  check('a correctly ordered sentence is accepted', /Correct/.test(await page.textContent('#sentence-feedback')),
    await page.textContent('#sentence-feedback'));
  const breakdown = await page.textContent('#sentence-explanation');
  check('sentence translation is in the right language', lang === 'zh' ? hasCJK(breakdown) : hasVietnamese(breakdown));
  check('word-by-word breakdown is shown', (await page.$$('#sentence-explanation li')).length > 0);

  // storage must not be shared between languages
  const keys = await page.evaluate(() => Object.keys(localStorage));
  check('meaning cache is namespaced per language',
    !keys.includes('engMeaningCache_v3_' + (lang === 'zh' ? 'vi' : 'zh')), keys);

  check('console is clean', errors.length === 0, errors.slice(0, 5));
  await ctx.close();
}

async function testSwitching(browser, base) {
  console.log('\n=== switching language ===');
  const { ctx, page } = await newPage(browser);
  await page.goto(base + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  check('default language is Vietnamese', await page.getAttribute('html', 'lang') === 'vi');

  await page.selectOption('#learner-lang-sidebar', 'zh');
  await page.waitForTimeout(1500);
  check('switching puts the language in the URL', page.url().includes('lang=zh'), page.url());
  check('switching stores the choice', await page.evaluate(() => localStorage.getItem('engLearnerLang')) === 'zh');
  check('cards switched to Chinese',
    hasCJK(await page.evaluate(() => document.querySelector('.word-card .translation').textContent)));

  await page.goto(base + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  check('the choice is remembered without ?lang', await page.getAttribute('html', 'lang') === 'zh-CN');
  await ctx.close();

  // an unknown language must fall back, not break and not be stored
  const second = await newPage(browser);
  await second.page.goto(base + '/index.html?lang=../../etc/passwd', { waitUntil: 'load' });
  await second.page.waitForTimeout(1000);
  check('unknown ?lang falls back to the default', await second.page.getAttribute('html', 'lang') === 'vi');
  check('unknown ?lang is not stored',
    await second.page.evaluate(() => localStorage.getItem('engLearnerLang')) === null);
  check('unknown ?lang does not break the page', second.errors.length === 0, second.errors.slice(0, 3));
  await second.ctx.close();
}

(async () => {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (e) {
    console.error('Playwright is not installed. It is only needed to run these tests,\n' +
                  'not to use the app. See tests/README.md.');
    process.exit(2);
  }

  const only = process.argv[2];
  const languages = only ? [only] : ['vi', 'zh'];

  const server = await serve();
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    for (const lang of languages) await testLanguage(browser, base, lang);
    if (!only) await testSwitching(browser, base);
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n${checks} checks, ${failures} failed`);
  process.exit(failures ? 1 : 0);
})();
