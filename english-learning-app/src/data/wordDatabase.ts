import { Word } from '../types';

export const wordDatabase: Record<string, Word[]> = {
  beginner: [
    { id: '1', english: 'apple', chinese: '苹果', pronunciation: 'ˈæpl', level: 'beginner', category: 'fruit' },
    { id: '2', english: 'book', chinese: '书', pronunciation: 'bʊk', level: 'beginner', category: 'object' },
    { id: '3', english: 'cat', chinese: '猫', pronunciation: 'kæt', level: 'beginner', category: 'animal' },
    { id: '4', english: 'dog', chinese: '狗', pronunciation: 'dɔːɡ', level: 'beginner', category: 'animal' },
    { id: '5', english: 'eat', chinese: '吃', pronunciation: 'iːt', level: 'beginner', category: 'verb' },
    { id: '6', english: 'friend', chinese: '朋友', pronunciation: 'frend', level: 'beginner', category: 'person' },
    { id: '7', english: 'good', chinese: '好的', pronunciation: 'ɡʊd', level: 'beginner', category: 'adjective' },
    { id: '8', english: 'happy', chinese: '快乐的', pronunciation: 'ˈhæpi', level: 'beginner', category: 'emotion' },
    { id: '9', english: 'ice', chinese: '冰', pronunciation: 'aɪs', level: 'beginner', category: 'nature' },
    { id: '10', english: 'jump', chinese: '跳', pronunciation: 'dʒʌmp', level: 'beginner', category: 'verb' },
    { id: '11', english: 'kind', chinese: '善良的', pronunciation: 'kaɪnd', level: 'beginner', category: 'adjective' },
    { id: '12', english: 'love', chinese: '爱', pronunciation: 'lʌv', level: 'beginner', category: 'emotion' },
    { id: '13', english: 'moon', chinese: '月亮', pronunciation: 'muːn', level: 'beginner', category: 'nature' },
    { id: '14', english: 'nice', chinese: '美好的', pronunciation: 'naɪs', level: 'beginner', category: 'adjective' },
    { id: '15', english: 'open', chinese: '打开', pronunciation: 'ˈoʊpən', level: 'beginner', category: 'verb' },
    { id: '16', english: 'play', chinese: '玩', pronunciation: 'pleɪ', level: 'beginner', category: 'verb' },
    { id: '17', english: 'quiet', chinese: '安静的', pronunciation: 'ˈkwaɪət', level: 'beginner', category: 'adjective' },
    { id: '18', english: 'run', chinese: '跑', pronunciation: 'rʌn', level: 'beginner', category: 'verb' },
    { id: '19', english: 'sun', chinese: '太阳', pronunciation: 'sʌn', level: 'beginner', category: 'nature' },
    { id: '20', english: 'tree', chinese: '树', pronunciation: 'triː', level: 'beginner', category: 'nature' },
    { id: '21', english: 'up', chinese: '向上', pronunciation: 'ʌp', level: 'beginner', category: 'direction' },
    { id: '22', english: 'voice', chinese: '声音', pronunciation: 'vɔɪs', level: 'beginner', category: 'sound' },
    { id: '23', english: 'water', chinese: '水', pronunciation: 'ˈwɔːtər', level: 'beginner', category: 'nature' },
    { id: '24', english: 'yes', chinese: '是的', pronunciation: 'jes', level: 'beginner', category: 'response' },
    { id: '25', english: 'zoo', chinese: '动物园', pronunciation: 'zuː', level: 'beginner', category: 'place' },
    { id: '26', english: 'big', chinese: '大的', pronunciation: 'bɪɡ', level: 'beginner', category: 'size' },
    { id: '27', english: 'small', chinese: '小的', pronunciation: 'smɔːl', level: 'beginner', category: 'size' },
    { id: '28', english: 'hot', chinese: '热的', pronunciation: 'hɑːt', level: 'beginner', category: 'temperature' },
    { id: '29', english: 'cold', chinese: '冷的', pronunciation: 'koʊld', level: 'beginner', category: 'temperature' },
    { id: '30', english: 'new', chinese: '新的', pronunciation: 'nuː', level: 'beginner', category: 'adjective' },
  ],
  intermediate: [
    { id: '31', english: 'accomplish', chinese: '完成', pronunciation: 'əˈkʌmplɪʃ', level: 'intermediate', category: 'verb' },
    { id: '32', english: 'beneficial', chinese: '有益的', pronunciation: 'ˌbenɪˈfɪʃl', level: 'intermediate', category: 'adjective' },
    { id: '33', english: 'comprehend', chinese: '理解', pronunciation: 'ˌkɑːmprɪˈhend', level: 'intermediate', category: 'verb' },
    { id: '34', english: 'determine', chinese: '决定', pronunciation: 'dɪˈtɜːrmɪn', level: 'intermediate', category: 'verb' },
    { id: '35', english: 'efficient', chinese: '高效的', pronunciation: 'ɪˈfɪʃnt', level: 'intermediate', category: 'adjective' },
    { id: '36', english: 'fundamental', chinese: '基本的', pronunciation: 'ˌfʌndəˈmentl', level: 'intermediate', category: 'adjective' },
    { id: '37', english: 'generate', chinese: '产生', pronunciation: 'ˈdʒenəreɪt', level: 'intermediate', category: 'verb' },
    { id: '38', english: 'hypothesis', chinese: '假设', pronunciation: 'haɪˈpɑːθəsɪs', level: 'intermediate', category: 'noun' },
    { id: '39', english: 'implement', chinese: '实施', pronunciation: 'ˈɪmplɪment', level: 'intermediate', category: 'verb' },
    { id: '40', english: 'justify', chinese: '证明正当', pronunciation: 'ˈdʒʌstɪfaɪ', level: 'intermediate', category: 'verb' },
    { id: '41', english: 'knowledge', chinese: '知识', pronunciation: 'ˈnɑːlɪdʒ', level: 'intermediate', category: 'noun' },
    { id: '42', english: 'logical', chinese: '合逻辑的', pronunciation: 'ˈlɑːdʒɪkl', level: 'intermediate', category: 'adjective' },
    { id: '43', english: 'maintain', chinese: '维持', pronunciation: 'meɪnˈteɪn', level: 'intermediate', category: 'verb' },
    { id: '44', english: 'necessary', chinese: '必要的', pronunciation: 'ˈnesəseri', level: 'intermediate', category: 'adjective' },
    { id: '45', english: 'opportunity', chinese: '机会', pronunciation: 'ˌɑːpərˈtuːnəti', level: 'intermediate', category: 'noun' },
    { id: '46', english: 'particular', chinese: '特别的', pronunciation: 'pərˈtɪkjələr', level: 'intermediate', category: 'adjective' },
    { id: '47', english: 'quantity', chinese: '数量', pronunciation: 'ˈkwɑːntəti', level: 'intermediate', category: 'noun' },
    { id: '48', english: 'relevant', chinese: '相关的', pronunciation: 'ˈreləvənt', level: 'intermediate', category: 'adjective' },
    { id: '49', english: 'significant', chinese: '重要的', pronunciation: 'sɪɡˈnɪfɪkənt', level: 'intermediate', category: 'adjective' },
    { id: '50', english: 'theory', chinese: '理论', pronunciation: 'ˈθɪəri', level: 'intermediate', category: 'noun' },
    { id: '51', english: 'understand', chinese: '理解', pronunciation: 'ˌʌndərˈstænd', level: 'intermediate', category: 'verb' },
    { id: '52', english: 'valuable', chinese: '有价值的', pronunciation: 'ˈvæljuəbl', level: 'intermediate', category: 'adjective' },
    { id: '53', english: 'wisdom', chinese: '智慧', pronunciation: 'ˈwɪzdəm', level: 'intermediate', category: 'noun' },
    { id: '54', english: 'analyze', chinese: '分析', pronunciation: 'ˈænəlaɪz', level: 'intermediate', category: 'verb' },
    { id: '55', english: 'balance', chinese: '平衡', pronunciation: 'ˈbæləns', level: 'intermediate', category: 'noun' },
    { id: '56', english: 'challenge', chinese: '挑战', pronunciation: 'ˈtʃælɪndʒ', level: 'intermediate', category: 'noun' },
    { id: '57', english: 'discover', chinese: '发现', pronunciation: 'dɪˈskʌvər', level: 'intermediate', category: 'verb' },
    { id: '58', english: 'explore', chinese: '探索', pronunciation: 'ɪkˈsplɔːr', level: 'intermediate', category: 'verb' },
    { id: '59', english: 'focus', chinese: '焦点', pronunciation: 'ˈfoʊkəs', level: 'intermediate', category: 'noun' },
    { id: '60', english: 'goal', chinese: '目标', pronunciation: 'ɡoʊl', level: 'intermediate', category: 'noun' },
  ],
  advanced: [
    { id: '61', english: 'ambiguous', chinese: '模糊的', pronunciation: 'æmˈbɪɡjuəs', level: 'advanced', category: 'adjective' },
    { id: '62', english: 'benevolent', chinese: '仁慈的', pronunciation: 'bəˈnevələnt', level: 'advanced', category: 'adjective' },
    { id: '63', english: 'conundrum', chinese: '难题', pronunciation: 'kəˈnʌndrəm', level: 'advanced', category: 'noun' },
    { id: '64', english: 'dichotomy', chinese: '二分法', pronunciation: 'daɪˈkɑːtəmi', level: 'advanced', category: 'noun' },
    { id: '65', english: 'ephemeral', chinese: '短暂的', pronunciation: 'ɪˈfemərəl', level: 'advanced', category: 'adjective' },
    { id: '66', english: 'facetious', chinese: '滑稽的', pronunciation: 'fəˈsiːʃəs', level: 'advanced', category: 'adjective' },
    { id: '67', english: 'gregarious', chinese: '群居的', pronunciation: 'ɡrɪˈɡeriəs', level: 'advanced', category: 'adjective' },
    { id: '68', english: 'harbinger', chinese: '先驱', pronunciation: 'ˈhɑːrbɪndʒər', level: 'advanced', category: 'noun' },
    { id: '69', english: 'idiosyncratic', chinese: '特异的', pronunciation: 'ˌɪdiəsɪŋˈkrætɪk', level: 'advanced', category: 'adjective' },
    { id: '70', english: 'juxtaposition', chinese: '并列', pronunciation: 'ˌdʒʌkstəpəˈzɪʃn', level: 'advanced', category: 'noun' },
    { id: '71', english: 'kaleidoscope', chinese: '万花筒', pronunciation: 'kəˈlaɪdəskoʊp', level: 'advanced', category: 'noun' },
    { id: '72', english: 'labyrinthine', chinese: '迷宫般的', pronunciation: 'ˌlæbəˈrɪnθaɪn', level: 'advanced', category: 'adjective' },
    { id: '73', english: 'melancholy', chinese: '忧郁', pronunciation: 'ˈmelənkɑːli', level: 'advanced', category: 'noun' },
    { id: '74', english: 'nefarious', chinese: '邪恶的', pronunciation: 'nɪˈferiəs', level: 'advanced', category: 'adjective' },
    { id: '75', english: 'obfuscate', chinese: '混淆', pronunciation: 'ˈɑːbfəskeɪt', level: 'advanced', category: 'verb' },
    { id: '76', english: 'paradigm', chinese: '范例', pronunciation: 'ˈpærədaɪm', level: 'advanced', category: 'noun' },
    { id: '77', english: 'quintessential', chinese: '典型的', pronunciation: 'ˌkwɪntɪˈsenʃl', level: 'advanced', category: 'adjective' },
    { id: '78', english: 'recalcitrant', chinese: '顽抗的', pronunciation: 'rɪˈkælsɪtrənt', level: 'advanced', category: 'adjective' },
    { id: '79', english: 'serendipity', chinese: '意外发现', pronunciation: 'ˌserənˈdɪpəti', level: 'advanced', category: 'noun' },
    { id: '80', english: 'taciturn', chinese: '沉默寡言的', pronunciation: 'ˈtæsɪtɜːrn', level: 'advanced', category: 'adjective' },
    { id: '81', english: 'ubiquitous', chinese: '无处不在的', pronunciation: 'juːˈbɪkwɪtəs', level: 'advanced', category: 'adjective' },
    { id: '82', english: 'vicarious', chinese: '替代的', pronunciation: 'vaɪˈkeriəs', level: 'advanced', category: 'adjective' },
    { id: '83', english: 'whimsical', chinese: '异想天开的', pronunciation: 'ˈwɪmzɪkl', level: 'advanced', category: 'adjective' },
    { id: '84', english: 'xenophobia', chinese: '仇外', pronunciation: 'ˌzenəˈfoʊbiə', level: 'advanced', category: 'noun' },
    { id: '85', english: 'yearning', chinese: '渴望', pronunciation: 'ˈjɜːrnɪŋ', level: 'advanced', category: 'noun' },
    { id: '86', english: 'zealous', chinese: '热心的', pronunciation: 'ˈzeləs', level: 'advanced', category: 'adjective' },
    { id: '87', english: 'aberration', chinese: '偏差', pronunciation: 'ˌæbəˈreɪʃn', level: 'advanced', category: 'noun' },
    { id: '88', english: 'bellicose', chinese: '好战的', pronunciation: 'ˈbelɪkoʊs', level: 'advanced', category: 'adjective' },
    { id: '89', english: 'cacophony', chinese: '刺耳的声音', pronunciation: 'kəˈkɑːfəni', level: 'advanced', category: 'noun' },
    { id: '90', english: 'dexterity', chinese: '灵巧', pronunciation: 'dekˈsterəti', level: 'advanced', category: 'noun' },
  ]
};

export function getRandomWords(level: 'beginner' | 'intermediate' | 'advanced' | 'mixed', count: number = 30): Word[] {
  let words: Word[] = [];
  
  if (level === 'mixed') {
    const levels = ['beginner', 'intermediate', 'advanced'] as const;
    const wordsPerLevel = Math.floor(count / 3);
    const remainder = count % 3;
    
    levels.forEach((lvl, index) => {
      const levelWords = wordDatabase[lvl];
      const wordCount = wordsPerLevel + (index < remainder ? 1 : 0);
      const shuffled = [...levelWords].sort(() => Math.random() - 0.5);
      words.push(...shuffled.slice(0, wordCount));
    });
  } else {
    const levelWords = wordDatabase[level];
    const shuffled = [...levelWords].sort(() => Math.random() - 0.5);
    words = shuffled.slice(0, Math.min(count, levelWords.length));
  }
  
  return words.sort(() => Math.random() - 0.5);
}