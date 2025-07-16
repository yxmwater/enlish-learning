import { TextbookData, Word, TextbookUnit, TextbookLesson } from '../types';

export interface PDFParseResult {
  success: boolean;
  textbook?: TextbookData;
  error?: string;
  rawText?: string;
}

export class PDFFileProcessor {
  // 验证PDF文本格式
  static validatePDFText(text: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 检查是否包含Unit标题
    if (!text.match(/Unit\s+\d+/i)) {
      issues.push('未找到Unit标题');
      suggestions.push('请确保文本包含"Unit 1"、"Unit 2"等单元标题');
    }

    // 检查是否包含Lesson标题
    if (!text.match(/Lesson\s+\d+/i)) {
      issues.push('未找到Lesson标题');
      suggestions.push('请确保文本包含"Lesson 1"、"Lesson 2"等课程标题');
    }

    // 检查是否包含单词格式
    if (!text.match(/\w+\s*-\s*[\u4e00-\u9fa5]+/)) {
      issues.push('未找到标准单词格式');
      suggestions.push('请确保单词格式为"hello - 你好"或"hello - 你好 [həˈloʊ]"');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  // 处理PDF文本
  static async processPDFText(text: string): Promise<PDFParseResult> {
    try {
      const textbook = this.parseTextbook(text);
      return {
        success: true,
        textbook
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        rawText: text
      };
    }
  }

  // 解析教材文本
  private static parseTextbook(text: string): TextbookData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let textbookName = '未知教材';
    let textbookDescription = '';
    const units: TextbookUnit[] = [];
    
    let currentUnit: TextbookUnit | null = null;
    let currentLesson: TextbookLesson | null = null;
    let currentUnitNumber = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检测教材名称（第一行通常是教材名称）
      if (i === 0 && !line.match(/^Unit\s+\d+/i)) {
        textbookName = line;
        continue;
      }
      
      // 检测Unit标题
      const unitMatch = line.match(/^Unit\s+(\d+)[\s:]*(.+)$/i);
      if (unitMatch) {
        // 保存之前的lesson
        if (currentLesson && currentUnit) {
          currentUnit.lessons.push(currentLesson);
        }
        
        // 保存之前的unit
        if (currentUnit) {
          units.push(currentUnit);
        }
        
        // 创建新的unit
        currentUnitNumber = unitMatch[1];
        currentUnit = {
          id: `unit-${unitMatch[1]}`,
          name: `Unit ${unitMatch[1]} ${unitMatch[2].trim()}`,
          lessons: []
        };
        
        currentLesson = null;
        continue;
      }
      
      // 检测Lesson标题
      const lessonMatch = line.match(/^Lesson\s+(\d+)[\s:]*(.+)$/i);
      if (lessonMatch && currentUnit) {
        // 保存之前的lesson
        if (currentLesson) {
          currentUnit.lessons.push(currentLesson);
        }
        
        // 创建新的lesson
        currentLesson = {
          id: `lesson-${currentUnitNumber}-${lessonMatch[1]}`,
          name: `Lesson ${lessonMatch[1]} ${lessonMatch[2].trim()}`,
          words: []
        };
        continue;
      }
      
      // 检测单词
      const wordMatch = line.match(/^(\w+)\s*-\s*([\u4e00-\u9fa5]+(?:\s*[\u4e00-\u9fa5]+)*)\s*(?:\[([^\]]+)\])?$/);
      if (wordMatch && currentLesson) {
        const word: Word = {
          id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          english: wordMatch[1].trim(),
          chinese: wordMatch[2].trim(),
          pronunciation: wordMatch[3] ? wordMatch[3].trim() : undefined
        };
        
        currentLesson.words.push(word);
      }
    }
    
    // 保存最后的lesson和unit
    if (currentLesson && currentUnit) {
      currentUnit.lessons.push(currentLesson);
    }
    if (currentUnit) {
      units.push(currentUnit);
    }
    
    return {
      info: {
        id: `textbook-${Date.now()}`,
        name: textbookName,
        description: textbookDescription || `${textbookName}包含${units.length}个单元`,
        grade: '三年级',
        publisher: '北京出版社',
        semester: '上册',
        region: '北京市'
      },
      units
    };
  }
} 