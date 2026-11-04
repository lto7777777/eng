// i18n.js — learner-language layer for Blebleble.
//
// The app chrome (nav, buttons) stays in English on purpose: it is an English
// learning app. What switches here is the *meaning* language — the glosses on
// dictionary cards, the flashcard prompts, the quiz questions and the grammar
// explanations — plus the few UI strings that name that language.
//
// Resolution order:  ?lang=xx in the URL  ->  localStorage  ->  DEFAULT_LANG.
// The URL form is what you share, e.g. index.html?lang=zh, and it is remembered
// from then on.
//
// Adding a language = add one entry to LEARNER_LANGS plus a meaning source
// (see MEANING_SOURCES in index.html).

const LEARNER_LANGS = {
  vi: {
    code: 'vi',
    nativeLabel: 'Tiếng Việt',
    htmlLang: 'vi',
    // language code for the runtime translation fallback
    apiCode: 'vi',
    // how the language is named inside English UI text
    languageNameEn: 'Vietnamese',
    strings: {
      fallbackMeaning: 'Chưa có nghĩa tiếng Việt',
      loadingSuffix: ' (đang tải...)',
      flashcardsDesc: 'Học từ vựng: tiếng Việt → tiếng Anh',
      quizDesc: 'Chọn đúng từ tiếng Anh cho nghĩa tiếng Việt',
      newWordsDesc: 'Ôn lại các từ mới bạn vừa học',
      grammarDesc: 'Learn English grammar and practice making sentences',
      quizQuestion: 'Tiếng Anh của nghĩa tiếng Việt sau là gì?',
      newWordsHint: 'Chọn đúng từ tiếng Anh.',
      translationLabel: 'Translation:',
      wordBreakdownLabel: 'Word breakdown:',
      meaningLanguageTitle: 'Meaning language',
      meaningLanguageHint: 'Ngôn ngữ dùng để giải nghĩa từ.',
      grammar: {
        'Present Tense': 'Present tense (Thì hiện tại): Subject + verb (add -s/-es for he/she/it). Example: I study English. / She drinks milk.',
        'Past Tense': 'Past tense (Thì quá khứ): Subject + verb-ed (or irregular form). Example: I ate breakfast. / He went home.',
        'Future Tense': 'Future tense (Thì tương lai): Subject + will + verb. Example: I will call you. / She will study tomorrow.',
        'Negation': "Negation (Phủ định): Subject + don't/doesn't + verb. Example: I don't like coffee. / He doesn't eat meat.",
        'Questions': 'Questions (Câu hỏi): Use question words (where/what/when/why/how) + do/does + subject + verb. Example: Where do you live?'
      }
    }
  },

  zh: {
    code: 'zh',
    nativeLabel: '中文',
    htmlLang: 'zh-CN',
    apiCode: 'zh-CN',
    languageNameEn: 'Chinese',
    strings: {
      fallbackMeaning: '暂无中文释义',
      loadingSuffix: '（加载中…）',
      flashcardsDesc: '学习词汇：中文 → 英语',
      quizDesc: '为中文释义选择正确的英语单词',
      newWordsDesc: '复习你刚学过的新单词',
      grammarDesc: '学习英语语法，练习造句',
      quizQuestion: '下面这个中文意思对应的英语单词是什么？',
      newWordsHint: '请选择正确的英语单词。',
      translationLabel: '翻译：',
      wordBreakdownLabel: '逐词解析：',
      meaningLanguageTitle: 'Meaning language',
      meaningLanguageHint: '用于解释单词含义的语言。',
      grammar: {
        'Present Tense': 'Present tense（现在时）：主语 + 动词（主语是 he/she/it 时动词加 -s/-es）。例：I study English. / She drinks milk.',
        'Past Tense': 'Past tense（过去时）：主语 + 动词过去式（规则变化加 -ed，不规则动词需单独记）。例：I ate breakfast. / He went home.',
        'Future Tense': 'Future tense（将来时）：主语 + will + 动词原形。例：I will call you. / She will study tomorrow.',
        'Negation': 'Negation（否定句）：主语 + don\'t/doesn\'t + 动词原形。例：I don\'t like coffee. / He doesn\'t eat meat.',
        'Questions': 'Questions（疑问句）：疑问词（where/what/when/why/how）+ do/does + 主语 + 动词。例：Where do you live?'
      }
    }
  }
};

// Strings that stay in English for every learner language, but have to name the
// current one. {language} is substituted by t().
const COMMON_STRINGS = {
  searchPlaceholder: 'Search English words or {language} meanings...',
  noMeaningsAlert: 'No words with {language} meanings are available for the New Words Quiz yet.',
  addedToStudyList: 'Added "{word}" to your study list!'
};

const DEFAULT_LEARNER_LANG = 'vi';
const LEARNER_LANG_STORAGE_KEY = 'engLearnerLang';

function readStoredLearnerLang() {
  try {
    return localStorage.getItem(LEARNER_LANG_STORAGE_KEY);
  } catch (e) {
    // private mode / blocked storage
    return null;
  }
}

function resolveLearnerLang() {
  let fromUrl = null;
  try {
    fromUrl = new URLSearchParams(window.location.search).get('lang');
  } catch (e) {
    fromUrl = null;
  }
  if (fromUrl && LEARNER_LANGS[fromUrl]) {
    try {
      localStorage.setItem(LEARNER_LANG_STORAGE_KEY, fromUrl);
    } catch (e) { /* ignore */ }
    return fromUrl;
  }

  const stored = readStoredLearnerLang();
  if (stored && LEARNER_LANGS[stored]) return stored;

  return DEFAULT_LEARNER_LANG;
}

const LEARNER_LANG = resolveLearnerLang();
const L10N = LEARNER_LANGS[LEARNER_LANG];

// t('quizQuestion') / t('searchPlaceholder', { count: 10 })
// {language} always resolves to the English name of the current meaning language.
function t(key, vars) {
  const raw = Object.prototype.hasOwnProperty.call(L10N.strings, key)
    ? L10N.strings[key]
    : COMMON_STRINGS[key];
  let text = typeof raw === 'string' ? raw : (key || '');
  const all = Object.assign({ language: L10N.languageNameEn }, vars || {});
  Object.keys(all).forEach(name => {
    text = text.split('{' + name + '}').join(String(all[name]));
  });
  return text;
}

function grammarExplanation(topic) {
  return (L10N.strings.grammar && L10N.strings.grammar[topic]) || '';
}

function setLearnerLang(code) {
  if (!LEARNER_LANGS[code] || code === LEARNER_LANG) return;
  try {
    localStorage.setItem(LEARNER_LANG_STORAGE_KEY, code);
  } catch (e) { /* ignore */ }
  // The dictionary bridge and every renderer read the language once at start-up,
  // so reload rather than trying to re-translate a half-built UI in place.
  const url = new URL(window.location.href);
  url.searchParams.set('lang', code);
  window.location.replace(url.toString());
}

// Fills [data-i18n] / [data-i18n-placeholder] elements from the string table.
function applyI18nDom(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
}

// Builds the <select> used in the sidebar and in Settings.
function fillLearnerLangSelect(select) {
  if (!select) return;
  select.innerHTML = '';
  Object.keys(LEARNER_LANGS).forEach(code => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = LEARNER_LANGS[code].nativeLabel;
    if (code === LEARNER_LANG) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener('change', () => setLearnerLang(select.value));
}

if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.setAttribute('lang', L10N.htmlLang);
}
