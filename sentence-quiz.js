// Sentence-building bank for the Grammar & Sentences screen.
//
// Each row carries the meaning in every learner language:
//   translations[lang]            - the whole sentence
//   wordExplanationsByLang[lang]  - one "english = meaning" line per word
// index.html reads them through sentenceTranslation() / sentenceWordExplanations(),
// which fall back to a plain `translation` / `wordExplanations` field if a row has
// not been given per-language data yet.

const sentenceQuizBank = [
  // Present Tense
  {
    level: 1, grammar: "Present Tense",
    prompt: "Make a sentence using: I, study, English",
    words: ["I", "study", "English"],
    correct: "I study English",
    translations: { vi: "Tôi học tiếng Anh", zh: "我学英语" },
    wordExplanationsByLang: {
      vi: ["I = Tôi", "study = học", "English = tiếng Anh"],
      zh: ["I = 我", "study = 学", "English = 英语"]
    }
  },
  {
    level: 1, grammar: "Present Tense",
    prompt: "Make a sentence using: you, play, soccer",
    words: ["You", "play", "soccer"],
    correct: "You play soccer",
    translations: { vi: "Bạn chơi bóng đá", zh: "你踢足球" },
    wordExplanationsByLang: {
      vi: ["you = bạn", "play = chơi", "soccer = bóng đá"],
      zh: ["you = 你", "play = 踢；玩", "soccer = 足球"]
    }
  },
  {
    level: 1, grammar: "Present Tense",
    prompt: "Make a sentence using: she, drink, milk",
    words: ["She", "drinks", "milk"],
    correct: "She drinks milk",
    translations: { vi: "Cô ấy uống sữa", zh: "她喝牛奶" },
    wordExplanationsByLang: {
      vi: ["she = cô ấy", "drinks = uống", "milk = sữa"],
      zh: ["she = 她", "drinks = 喝（主语是 she，动词加 -s）", "milk = 牛奶"]
    }
  },
  {
    level: 1, grammar: "Present Tense",
    prompt: "Make a sentence using: we, read, books",
    words: ["We", "read", "books"],
    correct: "We read books",
    translations: { vi: "Chúng tôi đọc sách", zh: "我们读书" },
    wordExplanationsByLang: {
      vi: ["we = chúng tôi", "read = đọc", "books = sách"],
      zh: ["we = 我们", "read = 读", "books = 书（复数）"]
    }
  },
  {
    level: 1, grammar: "Present Tense",
    prompt: "Make a sentence using: he, eat, rice",
    words: ["He", "eats", "rice"],
    correct: "He eats rice",
    translations: { vi: "Anh ấy ăn cơm", zh: "他吃米饭" },
    wordExplanationsByLang: {
      vi: ["he = anh ấy", "eats = ăn", "rice = cơm"],
      zh: ["he = 他", "eats = 吃（主语是 he，动词加 -s）", "rice = 米饭"]
    }
  },

  // Past Tense
  {
    level: 2, grammar: "Past Tense",
    prompt: "Make a sentence using: I, ate, breakfast",
    words: ["I", "ate", "breakfast"],
    correct: "I ate breakfast",
    translations: { vi: "Tôi đã ăn sáng", zh: "我吃了早饭" },
    wordExplanationsByLang: {
      vi: ["I = tôi", "ate = đã ăn", "breakfast = bữa sáng"],
      zh: ["I = 我", "ate = 吃了（eat 的过去式）", "breakfast = 早饭"]
    }
  },
  {
    level: 2, grammar: "Past Tense",
    prompt: "Make a sentence using: he, went, home",
    words: ["He", "went", "home"],
    correct: "He went home",
    translations: { vi: "Anh ấy đã về nhà", zh: "他回家了" },
    wordExplanationsByLang: {
      vi: ["he = anh ấy", "went = đã về", "home = nhà"],
      zh: ["he = 他", "went = 去了；回了（go 的过去式）", "home = 家"]
    }
  },
  {
    level: 2, grammar: "Past Tense",
    prompt: "Make a sentence using: they, watched, movie",
    words: ["They", "watched", "a", "movie"],
    correct: "They watched a movie",
    translations: { vi: "Họ đã xem phim", zh: "他们看了一部电影" },
    wordExplanationsByLang: {
      vi: ["they = họ", "watched = đã xem", "movie = phim"],
      zh: ["they = 他们", "watched = 看了（watch 的过去式）", "a = 一（部）", "movie = 电影"]
    }
  },

  // Future Tense
  {
    level: 3, grammar: "Future Tense",
    prompt: "Make a sentence using: I, will, call, you",
    words: ["I", "will", "call", "you"],
    correct: "I will call you",
    translations: { vi: "Tôi sẽ gọi cho bạn", zh: "我会给你打电话" },
    wordExplanationsByLang: {
      vi: ["I = tôi", "will call = sẽ gọi", "you = bạn"],
      zh: ["I = 我", "will = 会；将要", "call = 打电话", "you = 你"]
    }
  },
  {
    level: 3, grammar: "Future Tense",
    prompt: "Make a sentence using: she, will, study, tomorrow",
    words: ["She", "will", "study", "tomorrow"],
    correct: "She will study tomorrow",
    translations: { vi: "Cô ấy sẽ học vào ngày mai", zh: "她明天会学习" },
    wordExplanationsByLang: {
      vi: ["she = cô ấy", "will study = sẽ học", "tomorrow = ngày mai"],
      zh: ["she = 她", "will = 会；将要", "study = 学习", "tomorrow = 明天"]
    }
  },
  {
    level: 3, grammar: "Future Tense",
    prompt: "Make a sentence using: we, will, travel",
    words: ["We", "will", "travel", "tomorrow"],
    correct: "We will travel tomorrow",
    translations: { vi: "Chúng tôi sẽ đi du lịch ngày mai", zh: "我们明天会去旅行" },
    wordExplanationsByLang: {
      vi: ["we = chúng tôi", "will travel = sẽ đi du lịch", "tomorrow = ngày mai"],
      zh: ["we = 我们", "will = 会；将要", "travel = 旅行", "tomorrow = 明天"]
    }
  },

  // Questions
  {
    level: 2, grammar: "Questions",
    prompt: "Make a question using: where, do, you, live",
    words: ["Where", "do", "you", "live"],
    correct: "Where do you live?",
    translations: { vi: "Bạn sống ở đâu?", zh: "你住在哪里？" },
    wordExplanationsByLang: {
      vi: ["where = ở đâu", "do you = bạn", "live = sống"],
      zh: ["where = 哪里", "do = 助动词，用来构成疑问句", "you = 你", "live = 住"]
    }
  },
  {
    level: 2, grammar: "Questions",
    prompt: "Make a question using: what, are, you, doing",
    words: ["What", "are", "you", "doing"],
    correct: "What are you doing?",
    translations: { vi: "Bạn đang làm gì?", zh: "你在做什么？" },
    wordExplanationsByLang: {
      vi: ["what = gì", "are you = bạn", "doing = đang làm"],
      zh: ["what = 什么", "are = be 动词，和 doing 一起表示正在进行", "you = 你", "doing = 在做"]
    }
  },
  {
    level: 2, grammar: "Questions",
    prompt: "Make a question using: when, will, you, come",
    words: ["When", "will", "you", "come"],
    correct: "When will you come?",
    translations: { vi: "Khi nào bạn sẽ đến?", zh: "你什么时候来？" },
    wordExplanationsByLang: {
      vi: ["when = khi nào", "will = sẽ", "you = bạn", "come = đến"],
      zh: ["when = 什么时候", "will = 会；将要", "you = 你", "come = 来"]
    }
  },

  // Negation
  {
    level: 2, grammar: "Negation",
    prompt: "Make a negative sentence using: I, don't, like, coffee",
    words: ["I", "don't", "like", "coffee"],
    correct: "I don't like coffee",
    translations: { vi: "Tôi không thích cà phê", zh: "我不喜欢咖啡" },
    wordExplanationsByLang: {
      vi: ["I = tôi", "don't like = không thích", "coffee = cà phê"],
      zh: ["I = 我", "don't = 不（do not 的缩写）", "like = 喜欢", "coffee = 咖啡"]
    }
  },
  {
    level: 2, grammar: "Negation",
    prompt: "Make a negative sentence using: he, doesn't, eat, meat",
    words: ["He", "doesn't", "eat", "meat"],
    correct: "He doesn't eat meat",
    translations: { vi: "Anh ấy không ăn thịt", zh: "他不吃肉" },
    wordExplanationsByLang: {
      vi: ["he = anh ấy", "doesn't eat = không ăn", "meat = thịt"],
      zh: ["he = 他", "doesn't = 不（主语是 he/she/it 时用 doesn't）", "eat = 吃", "meat = 肉"]
    }
  },
  {
    level: 2, grammar: "Negation",
    prompt: "Make a negative sentence using: we, don't, watch, TV",
    words: ["We", "don't", "watch", "TV"],
    correct: "We don't watch TV",
    translations: { vi: "Chúng tôi không xem TV", zh: "我们不看电视" },
    wordExplanationsByLang: {
      vi: ["we = chúng tôi", "don't watch = không xem", "TV = TV"],
      zh: ["we = 我们", "don't = 不（do not 的缩写）", "watch = 看", "TV = 电视"]
    }
  }
];
