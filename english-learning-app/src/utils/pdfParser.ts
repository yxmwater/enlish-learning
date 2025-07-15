import { Word, TextbookData, TextbookUnit, TextbookLesson } from '../types';

// PDF解析结果接口
export interface PDFParseResult {
  success: boolean;
  textbook?: TextbookData;
  error?: string;
  rawText?: string;
}

// 章节识别模式
export interface ChapterPattern {
  unitPattern: RegExp;
  lessonPattern: RegExp;
  wordPattern: RegExp;
}

// 北京版教材章节模式
export const beijingPatterns: ChapterPattern = {
  unitPattern: /Unit\s+(\d+)\s*[-:]?\s*(.+?)(?=\n|$)/gi,
  lessonPattern: /Lesson\s+(\d+)\s*[-:]?\s*(.+?)(?=\n|$)/gi,
  wordPattern: /([a-zA-Z]+)\s*[-:]?\s*([^\n\r]+?)(?:\s*\[([^\]]+)\])?(?=\n|$)/g
};

// PDF文本解析器
export class PDFTextParser {
  private textbookId: string;
  private textbookName: string;
  private patterns: ChapterPattern;

  constructor(textbookId: string, textbookName: string, patterns: ChapterPattern) {
    this.textbookId = textbookId;
    this.textbookName = textbookName;
    this.patterns = patterns;
  }

  // 解析PDF文本内容
  parseTextContent(text: string): PDFParseResult {
    try {
      // 清理文本
      const cleanText = this.cleanText(text);
      
      // 提取章节结构
      const units = this.extractUnits(cleanText);
      
      if (units.length === 0) {
        return {
          success: false,
          error: '未能识别到有效的章节结构',
          rawText: cleanText
        };
      }

      // 构建教材数据
      const textbook: TextbookData = {
        info: {
          id: this.textbookId,
          name: this.textbookName,
          publisher: '北京出版社',
          grade: '三年级',
          semester: '上册',
          region: '北京市',
          description: `从PDF文件解析的${this.textbookName}内容`
        },
        units: units
      };

      return {
        success: true,
        textbook: textbook,
        rawText: cleanText
      };
    } catch (error) {
      return {
        success: false,
        error: `解析失败: ${error}`,
        rawText: text
      };
    }
  }

  // 清理文本内容
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();
  }

  // 提取单元内容
  private extractUnits(text: string): TextbookUnit[] {
    const units: TextbookUnit[] = [];
    const unitMatches = Array.from(text.matchAll(this.patterns.unitPattern));

    for (let i = 0; i < unitMatches.length; i++) {
      const match = unitMatches[i];
      const unitNumber = match[1];
      const unitTitle = match[2].trim();
      
      // 确定单元内容范围
      const startIndex = match.index || 0;
      const endIndex = i < unitMatches.length - 1 
        ? unitMatches[i + 1].index || text.length 
        : text.length;
      
      const unitContent = text.substring(startIndex, endIndex);
      
      // 提取课程
      const lessons = this.extractLessons(unitContent, unitNumber);
      
      if (lessons.length > 0) {
        units.push({
          id: `unit${unitNumber}`,
          name: `Unit ${unitNumber} - ${unitTitle}`,
          description: unitTitle,
          lessons: lessons
        });
      }
    }

    return units;
  }

  // 提取课程内容
  private extractLessons(unitContent: string, unitNumber: string): TextbookLesson[] {
    const lessons: TextbookLesson[] = [];
    const lessonMatches = Array.from(unitContent.matchAll(this.patterns.lessonPattern));

    if (lessonMatches.length === 0) {
      // 如果没有明确的课程划分，创建一个默认课程
      const words = this.extractWords(unitContent, `unit${unitNumber}-lesson1`);
      if (words.length > 0) {
        lessons.push({
          id: `lesson1`,
          name: `Lesson 1 - Main Content`,
          description: '主要内容',
          words: words
        });
      }
    } else {
      for (let i = 0; i < lessonMatches.length; i++) {
        const match = lessonMatches[i];
        const lessonNumber = match[1];
        const lessonTitle = match[2].trim();
        
        // 确定课程内容范围
        const startIndex = match.index || 0;
        const endIndex = i < lessonMatches.length - 1 
          ? lessonMatches[i + 1].index || unitContent.length 
          : unitContent.length;
        
        const lessonContent = unitContent.substring(startIndex, endIndex);
        const words = this.extractWords(lessonContent, `unit${unitNumber}-lesson${lessonNumber}`);
        
        if (words.length > 0) {
          lessons.push({
            id: `lesson${lessonNumber}`,
            name: `Lesson ${lessonNumber} - ${lessonTitle}`,
            description: lessonTitle,
            words: words
          });
        }
      }
    }

    return lessons;
  }

  // 提取单词
  private extractWords(content: string, sourceId: string): Word[] {
    const words: Word[] = [];
    const wordMatches = Array.from(content.matchAll(this.patterns.wordPattern));
    
    wordMatches.forEach((match, index) => {
      const english = match[1].trim().toLowerCase();
      const chinese = match[2].trim();
      const pronunciation = match[3] ? match[3].trim() : undefined;
      
      // 过滤掉明显不是单词的内容
      if (this.isValidWord(english, chinese)) {
        words.push({
          id: `${sourceId}-${index}`,
          english: english,
          chinese: chinese,
          pronunciation: pronunciation,
          level: 'beginner',
          category: 'textbook',
          textbook: this.textbookId,
          unit: sourceId.split('-')[0],
          lesson: sourceId.split('-')[1]
        });
      }
    });

    return words;
  }

  // 验证是否为有效单词
  private isValidWord(english: string, chinese: string): boolean {
    // 英文单词基本验证
    if (english.length < 2 || english.length > 20) return false;
    if (!/^[a-zA-Z]+$/.test(english)) return false;
    
    // 中文释义基本验证
    if (chinese.length < 1 || chinese.length > 20) return false;
    if (/^[a-zA-Z\s]+$/.test(chinese)) return false; // 纯英文不是中文释义
    
    // 排除常见的非单词内容
    const excludeWords = ['unit', 'lesson', 'page', 'chapter', 'exercise', 'homework'];
    if (excludeWords.includes(english.toLowerCase())) return false;
    
    return true;
  }
}

// 创建北京版教材解析器
export function createBeijingParser(): PDFTextParser {
  return new PDFTextParser(
    'beijing-grade3-vol1-pdf',
    '北京版小学英语三年级上册',
    beijingPatterns
  );
}

// 智能识别教材版本
export function detectTextbookVersion(text: string): {
  version: string;
  confidence: number;
  parser: PDFTextParser;
} {
  const cleanText = text.toLowerCase();
  
  // 北京版特征
  const beijingFeatures = [
    /北京版/,
    /beijing\s+edition/,
    /北京出版社/,
    /beijing\s+publishing/
  ];
  
  // 人教版特征
  const pepFeatures = [
    /人教版/,
    /人民教育出版社/,
    /people.?s\s+education/,
    /pep/
  ];
  
  let beijingScore = 0;
  let pepScore = 0;
  
  beijingFeatures.forEach(pattern => {
    if (pattern.test(cleanText)) beijingScore++;
  });
  
  pepFeatures.forEach(pattern => {
    if (pattern.test(cleanText)) pepScore++;
  });
  
  // 根据内容特征判断
  if (beijingScore > pepScore) {
    return {
      version: 'beijing',
      confidence: beijingScore / beijingFeatures.length,
      parser: createBeijingParser()
    };
  } else {
    // 默认使用北京版解析器
    return {
      version: 'beijing',
      confidence: 0.5,
      parser: createBeijingParser()
    };
  }
}

// 文件处理工具
export class PDFFileProcessor {
  // 处理PDF文件（需要用户手动复制文本）
  static async processPDFText(text: string): Promise<PDFParseResult> {
    // 自动检测教材版本
    const detection = detectTextbookVersion(text);
    
    // 使用对应的解析器
    return detection.parser.parseTextContent(text);
  }
  
  // 验证PDF文本内容
  static validatePDFText(text: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (text.length < 100) {
      issues.push('文本内容过短');
      suggestions.push('请确保复制了完整的PDF内容');
    }
    
    if (!/unit/i.test(text)) {
      issues.push('未检测到单元结构');
      suggestions.push('请确保PDF包含Unit 1, Unit 2等章节标题');
    }
    
    if (!/[a-zA-Z]/i.test(text)) {
      issues.push('未检测到英文内容');
      suggestions.push('请确保PDF包含英语单词');
    }
    
    if (!/[\u4e00-\u9fff]/.test(text)) {
      issues.push('未检测到中文内容');
      suggestions.push('请确保PDF包含中文释义');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
} 