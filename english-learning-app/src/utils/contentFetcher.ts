import { Word } from '../types';

// 网络内容获取接口
export interface ContentSource {
  id: string;
  name: string;
  url: string;
  type: 'webpage' | 'api' | 'json' | 'text';
  parser: (content: string) => Word[];
}

// 词汇解析工具
export class VocabularyParser {
  // 解析常见的单词格式
  static parseWordLine(line: string, index: number, source: string): Word | null {
    // 格式1: "apple - 苹果 [ˈæpl]"
    const format1 = /^(.+?)\s*-\s*(.+?)\s*\[(.+?)\]$/;
    // 格式2: "apple 苹果 /ˈæpl/"
    const format2 = /^(.+?)\s+(.+?)\s*\/(.+?)\//;
    // 格式3: "apple: 苹果 (ˈæpl)"
    const format3 = /^(.+?):\s*(.+?)\s*\((.+?)\)$/;
    // 格式4: "apple，苹果，ˈæpl"
    const format4 = /^(.+?)，(.+?)，(.+?)$/;
    
    let match = line.match(format1) || line.match(format2) || line.match(format3) || line.match(format4);
    
    if (match) {
      const [, english, chinese, pronunciation] = match;
      return {
        id: `${source}-${index}`,
        english: english.trim(),
        chinese: chinese.trim(),
        pronunciation: pronunciation.trim(),
        level: 'beginner',
        category: 'imported',
        textbook: source,
        unit: 'imported',
        lesson: 'imported'
      };
    }
    
    // 简单格式: "apple 苹果"
    const simpleFormat = /^(.+?)\s+(.+?)$/;
    match = line.match(simpleFormat);
    if (match) {
      const [, english, chinese] = match;
      return {
        id: `${source}-${index}`,
        english: english.trim(),
        chinese: chinese.trim(),
        level: 'beginner',
        category: 'imported',
        textbook: source,
        unit: 'imported',
        lesson: 'imported'
      };
    }
    
    return null;
  }
  
  // 从文本内容中提取单词
  static extractWordsFromText(content: string, source: string): Word[] {
    const lines = content.split('\n');
    const words: Word[] = [];
    
    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      if (cleanLine && !cleanLine.startsWith('#') && !cleanLine.startsWith('//')) {
        const word = this.parseWordLine(cleanLine, index, source);
        if (word) {
          words.push(word);
        }
      }
    });
    
    return words;
  }
  
  // 从HTML内容中提取单词
  static extractWordsFromHTML(html: string, source: string): Word[] {
    // 移除HTML标签
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    
    // 查找可能的单词模式
    const wordPatterns = [
      // 中英文对照模式
             /([a-zA-Z]+)\s*[：:-]\s*([^\s\n]+)/g,
      // 括号模式
      /([a-zA-Z]+)\s*\(([^)]+)\)/g,
    ];
    
    const words: Word[] = [];
    let wordIndex = 0;
    
    wordPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(textContent)) !== null) {
        const english = match[1].trim();
        const chinese = match[2].trim();
        
        if (english.length > 1 && chinese.length > 0) {
          words.push({
            id: `${source}-${wordIndex++}`,
            english: english.toLowerCase(),
            chinese: chinese,
            level: 'beginner',
            category: 'imported',
            textbook: source,
            unit: 'imported',
            lesson: 'imported'
          });
        }
      }
    });
    
    return words;
  }
}

// 网络内容获取器
export class ContentFetcher {
  // 由于浏览器CORS限制，我们需要使用代理或者让用户手动输入内容
  static async fetchContent(url: string): Promise<string> {
    try {
      // 这里需要使用CORS代理或者后端API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Failed to fetch content:', error);
      throw error;
    }
  }
  
  // 处理不同类型的内容源
  static async processContentSource(source: ContentSource): Promise<Word[]> {
    try {
      const content = await this.fetchContent(source.url);
      return source.parser(content);
    } catch (error) {
      console.error(`Failed to process content from ${source.name}:`, error);
      return [];
    }
  }
}

// 预定义的内容源
export const predefinedSources: ContentSource[] = [
  {
    id: 'beijing-grade3-spring',
    name: '北京版三年级下册',
    url: 'https://mp.weixin.qq.com/s?__biz=MzIxNTYzMDc5MA==&mid=2247629847&idx=2&sn=b9b2fbcb717f0f7758788ee2a78aa7f1&chksm=96e5657a8172eac15e667d5175f8dc562901d54ff0e268702f1fe6509f5d61c4668ae9767d57&scene=27',
    type: 'webpage',
    parser: (content: string) => VocabularyParser.extractWordsFromHTML(content, 'beijing-grade3-spring')
  },
  {
    id: 'sample-text',
    name: '示例文本格式',
    url: '',
    type: 'text',
    parser: (content: string) => VocabularyParser.extractWordsFromText(content, 'sample-text')
  }
];

// 常用教材词汇API端点（示例）
export const educationAPIs = {
  // 这些是示例API，实际使用时需要替换为真实的教育资源API
  peopleEducation: 'https://api.pep.com.cn/vocabulary/grade3',
  beijingEducation: 'https://api.bjedu.cn/textbook/vocabulary',
  oxfordPrimary: 'https://api.oup.com/primary/vocabulary',
};

// 从多个来源合并词汇
export function mergeVocabularyFromSources(wordLists: Word[][]): Word[] {
  const mergedWords: Word[] = [];
  const seenWords = new Set<string>();
  
  wordLists.forEach(wordList => {
    wordList.forEach(word => {
      const key = `${word.english.toLowerCase()}-${word.chinese}`;
      if (!seenWords.has(key)) {
        seenWords.add(key);
        mergedWords.push(word);
      }
    });
  });
  
  return mergedWords;
} 