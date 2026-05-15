const sentenceQuizBank = [
  // Present Tense
  { level: 1, grammar: "Present Tense", prompt: "Make a sentence using: I, study, English", words: ["I", "study", "English"], correct: "I study English", translation: "Tôi học tiếng Anh", wordExplanations: ["I = Tôi", "study = học", "English = tiếng Anh"] },
  { level: 1, grammar: "Present Tense", prompt: "Make a sentence using: you, play, soccer", words: ["you", "play", "soccer"], correct: "You play soccer", translation: "Bạn chơi bóng đá", wordExplanations: ["you = bạn", "play = chơi", "soccer = bóng đá"] },
  { level: 1, grammar: "Present Tense", prompt: "Make a sentence using: she, drink, milk", words: ["she", "drinks", "milk"], correct: "She drinks milk", translation: "Cô ấy uống sữa", wordExplanations: ["she = cô ấy", "drinks = uống", "milk = sữa"] },
  { level: 1, grammar: "Present Tense", prompt: "Make a sentence using: we, read, books", words: ["we", "read", "books"], correct: "We read books", translation: "Chúng tôi đọc sách", wordExplanations: ["we = chúng tôi", "read = đọc", "books = sách"] },
  { level: 1, grammar: "Present Tense", prompt: "Make a sentence using: he, eat, rice", words: ["he", "eats", "rice"], correct: "He eats rice", translation: "Anh ấy ăn cơm", wordExplanations: ["he = anh ấy", "eats = ăn", "rice = cơm"] },
  
  // Past Tense
  { level: 2, grammar: "Past Tense", prompt: "Make a sentence using: I, ate, breakfast", words: ["I", "ate", "breakfast"], correct: "I ate breakfast", translation: "Tôi đã ăn sáng", wordExplanations: ["I = tôi", "ate = đã ăn", "breakfast = bữa sáng"] },
  { level: 2, grammar: "Past Tense", prompt: "Make a sentence using: he, went, home", words: ["he", "went", "home"], correct: "He went home", translation: "Anh ấy đã về nhà", wordExplanations: ["he = anh ấy", "went = đã về", "home = nhà"] },
  { level: 2, grammar: "Past Tense", prompt: "Make a sentence using: they, watched, movie", words: ["they", "watched", "a", "movie"], correct: "They watched a movie", translation: "Họ đã xem phim", wordExplanations: ["they = họ", "watched = đã xem", "movie = phim"] },
  
  // Future Tense
  { level: 3, grammar: "Future Tense", prompt: "Make a sentence using: I, will, call, you", words: ["I", "will", "call", "you"], correct: "I will call you", translation: "Tôi sẽ gọi cho bạn", wordExplanations: ["I = tôi", "will call = sẽ gọi", "you = bạn"] },
  { level: 3, grammar: "Future Tense", prompt: "Make a sentence using: she, will, study, tomorrow", words: ["she", "will", "study", "tomorrow"], correct: "She will study tomorrow", translation: "Cô ấy sẽ học vào ngày mai", wordExplanations: ["she = cô ấy", "will study = sẽ học", "tomorrow = ngày mai"] },
  { level: 3, grammar: "Future Tense", prompt: "Make a sentence using: we, will, travel", words: ["we", "will", "travel", "tomorrow"], correct: "We will travel tomorrow", translation: "Chúng tôi sẽ đi du lịch ngày mai", wordExplanations: ["we = chúng tôi", "will travel = sẽ đi du lịch", "tomorrow = ngày mai"] },
  
  // Questions
  { level: 2, grammar: "Questions", prompt: "Make a question using: where, do, you, live", words: ["where", "do", "you", "live"], correct: "Where do you live?", translation: "Bạn sống ở đâu?", wordExplanations: ["where = ở đâu", "do you = bạn", "live = sống"] },
  { level: 2, grammar: "Questions", prompt: "Make a question using: what, are, you, doing", words: ["what", "are", "you", "doing"], correct: "What are you doing?", translation: "Bạn đang làm gì?", wordExplanations: ["what = gì", "are you = bạn", "doing = đang làm"] },
  { level: 2, grammar: "Questions", prompt: "Make a question using: when, will, you, come", words: ["when", "will", "you", "come"], correct: "When will you come?", translation: "Khi nào bạn sẽ đến?", wordExplanations: ["when = khi nào", "will = sẽ", "you = bạn", "come = đến"] },
  
  // Negation
  { level: 2, grammar: "Negation", prompt: "Make a negative sentence using: I, don't, like, coffee", words: ["I", "don't", "like", "coffee"], correct: "I don't like coffee", translation: "Tôi không thích cà phê", wordExplanations: ["I = tôi", "don't like = không thích", "coffee = cà phê"] },
  { level: 2, grammar: "Negation", prompt: "Make a negative sentence using: he, doesn't, eat, meat", words: ["he", "doesn't", "eat", "meat"], correct: "He doesn't eat meat", translation: "Anh ấy không ăn thịt", wordExplanations: ["he = anh ấy", "doesn't eat = không ăn", "meat = thịt"] },
  { level: 2, grammar: "Negation", prompt: "Make a negative sentence using: we, don't, watch, TV", words: ["we", "don't", "watch", "TV"], correct: "We don't watch TV", translation: "Chúng tôi không xem TV", wordExplanations: ["we = chúng tôi", "don't watch = không xem", "TV = TV"] }
];
