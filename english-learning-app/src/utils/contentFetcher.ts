import { Word } from '../types';

// 预定义的词汇来源
export const predefinedSources = [
  {
    id: 'cambridge-basic',
    name: 'Cambridge Basic English',
    url: 'https://www.cambridgeenglish.org/learning-english/parents-and-children/information-for-parents/tips-and-advice/vocabulary-games-and-activities/',
    description: '剑桥基础英语词汇'
  },
  {
    id: 'oxford-3000',
    name: 'Oxford 3000',
    url: 'https://www.oxfordlearnersdictionaries.com/wordlist/english/oxford3000/',
    description: '牛津3000核心词汇'
  }
];

// 词汇解析器
export class VocabularyParser {
  // 从文本中提取单词
  static extractWordsFromText(text: string, source: string): Word[] {
    const words: Word[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const word = this.parseWordLine(line, source);
      if (word) {
        words.push(word);
      }
    }
    
    return words;
  }
  
  // 从HTML中提取单词
  static extractWordsFromHTML(html: string, source: string): Word[] {
    // 创建临时DOM元素来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // 提取文本内容
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    return this.extractWordsFromText(text, source);
  }
  
  // 解析单词行
  private static parseWordLine(line: string, source: string): Word | null {
    // 支持多种格式:
    // 1. "hello - 你好"
    // 2. "hello - 你好 [həˈloʊ]"
    // 3. "hello: 你好"
    // 4. "hello 你好"
    
    const patterns = [
      /^(\w+)\s*-\s*([\u4e00-\u9fa5]+(?:\s*[\u4e00-\u9fa5]+)*)\s*(?:\[([^\]]+)\])?$/,
      /^(\w+)\s*:\s*([\u4e00-\u9fa5]+(?:\s*[\u4e00-\u9fa5]+)*)\s*(?:\[([^\]]+)\])?$/,
      /^(\w+)\s+([\u4e00-\u9fa5]+(?:\s*[\u4e00-\u9fa5]+)*)\s*(?:\[([^\]]+)\])?$/
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return {
          id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          english: match[1].trim().toLowerCase(),
          chinese: match[2].trim(),
          pronunciation: match[3] ? match[3].trim() : undefined,
          category: source
        };
      }
    }
    
    return null;
  }
  
  // 验证单词格式
  static validateWordFormat(text: string): {
    isValid: boolean;
    errors: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      errors.push('文本内容为空');
      suggestions.push('请输入单词内容');
      return { isValid: false, errors, suggestions };
    }
    
    let validLines = 0;
    
    for (const line of lines) {
      if (this.parseWordLine(line, 'validation')) {
        validLines++;
      }
    }
    
    if (validLines === 0) {
      errors.push('未找到有效的单词格式');
      suggestions.push('请使用格式: "hello - 你好" 或 "hello - 你好 [həˈloʊ]"');
    } else if (validLines < lines.length) {
      errors.push(`${lines.length - validLines} 行格式不正确`);
      suggestions.push('请检查每行的格式是否正确');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }
}

// 内容获取器（由于CORS限制，实际使用时需要后端支持）
export class ContentFetcher {
  // 获取网页内容
  static async fetchContent(url: string): Promise<string> {
    try {
      // 注意：由于CORS限制，这在浏览器中通常不会工作
      // 实际应用中需要后端代理或CORS代理服务
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`无法获取网页内容: ${error}`);
    }
  }
  
  // 获取预定义来源的内容
  static async fetchPredefinedSource(sourceId: string): Promise<Word[]> {
    const source = predefinedSources.find(s => s.id === sourceId);
    if (!source) {
      throw new Error('未找到指定的词汇来源');
    }
    
    try {
      const content = await this.fetchContent(source.url);
      return VocabularyParser.extractWordsFromHTML(content, sourceId);
    } catch (error) {
      throw new Error(`获取 ${source.name} 失败: ${error}`);
    }
  }
} 