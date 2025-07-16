// 学习记录评分标准
export const ScoreStandard = {
  EXCELLENT: { min: 90, label: '优秀', description: '记忆力超群，继续保持！' },
  GOOD: { min: 75, label: '良好', description: '掌握得不错，有待提高。' },
  FAIR: { min: 60, label: '一般', description: '需要多加练习。' },
  POOR: { min: 0, label: '待加强', description: '建议重新复习。' }
};

export interface LearningRecord {
  id?: number;
  userId: string;
  gameType: 'match' | 'spell';
  wordCount: number;
  correctCount: number;
  timeSpent: number;
  score: number;
  evaluation: string;
  timestamp: Date;
}

export interface WordbookEntry {
  id?: number;
  userId: string;
  word: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  addedAt: Date;
  lastReviewedAt: Date | null;
  reviewCount: number;
  mastered: boolean;
}

export interface WordImportHistory {
  id?: number;
  userId: string;
  source_type: 'file' | 'manual' | 'random' | 'textbook' | 'web' | 'pdf' | 'ocr';
  title: string;
  content: string;
  word_count: number;
  created_at: Date;
}

export interface HistoryStats {
  totalRecords: number;
  totalWords: number;
  sourceDistribution: { [key: string]: number };
  recentActivity: { date: string; count: number }[];
}

// 浏览器兼容的数据库管理器（使用localStorage）
export class DatabaseManager {
  private static readonly STORAGE_KEYS = {
    LEARNING_RECORDS: 'english_learning_records',
    WORDBOOK: 'english_learning_wordbook',
    IMPORT_HISTORY: 'english_learning_history'
  };

  static async initialize() {
    try {
      // 在浏览器环境中，我们使用localStorage，不需要初始化
      console.log('本地存储数据库初始化成功');
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  // 计算学习评分
  static calculateScore(correctCount: number, wordCount: number, timeSpent: number): number {
    const accuracyScore = (correctCount / wordCount) * 70; // 准确率占70分
    const timePerWord = timeSpent / wordCount;
    const timeScore = Math.max(0, 30 - (timePerWord - 10) * 2); // 时间得分占30分，每词基准时间10秒
    return Math.round(accuracyScore + timeScore);
  }

  // 获取评价
  static getEvaluation(score: number): string {
    if (score >= ScoreStandard.EXCELLENT.min) {
      return ScoreStandard.EXCELLENT.description;
    } else if (score >= ScoreStandard.GOOD.min) {
      return ScoreStandard.GOOD.description;
    } else if (score >= ScoreStandard.FAIR.min) {
      return ScoreStandard.FAIR.description;
    } else {
      return ScoreStandard.POOR.description;
    }
  }

  // 保存学习记录
  static async saveLearningRecord(record: LearningRecord): Promise<number> {
    try {
      const records = this.getLearningRecordsSync();
      const newRecord = {
        ...record,
        id: Date.now(),
        timestamp: new Date()
      };
      records.push(newRecord);
      localStorage.setItem(this.STORAGE_KEYS.LEARNING_RECORDS, JSON.stringify(records));
      return newRecord.id;
    } catch (error) {
      console.error('保存学习记录失败:', error);
      throw error;
    }
  }

  // 获取学习记录
  static async getLearningRecords(userId: string): Promise<LearningRecord[]> {
    try {
      const records = this.getLearningRecordsSync();
      return records
        .filter(record => record.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('获取学习记录失败:', error);
      throw error;
    }
  }

  private static getLearningRecordsSync(): LearningRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.LEARNING_RECORDS);
    return data ? JSON.parse(data) : [];
  }

  // 添加单词到单词本
  static async addToWordbook(entry: WordbookEntry): Promise<void> {
    try {
      const entries = this.getWordbookEntriesSync();
      const existingIndex = entries.findIndex(e => e.userId === entry.userId && e.word === entry.word);
      
      if (existingIndex >= 0) {
        // 更新现有条目
        entries[existingIndex] = {
          ...entries[existingIndex],
          translation: entry.translation,
          difficulty: entry.difficulty
        };
      } else {
        // 添加新条目
        entries.push({
          ...entry,
          id: Date.now(),
          addedAt: new Date(),
          lastReviewedAt: null,
          reviewCount: 0,
          mastered: false
        });
      }
      
      localStorage.setItem(this.STORAGE_KEYS.WORDBOOK, JSON.stringify(entries));
    } catch (error) {
      console.error('添加单词失败:', error);
      throw error;
    }
  }

  // 从单词本获取单词
  static async getWordbookEntries(userId: string): Promise<WordbookEntry[]> {
    try {
      const entries = this.getWordbookEntriesSync();
      return entries
        .filter(entry => entry.userId === userId)
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    } catch (error) {
      console.error('获取单词本失败:', error);
      throw error;
    }
  }

  private static getWordbookEntriesSync(): WordbookEntry[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.WORDBOOK);
    return data ? JSON.parse(data) : [];
  }

  // 更新单词掌握状态
  static async updateWordMastery(userId: string, word: string, mastered: boolean): Promise<void> {
    try {
      const entries = this.getWordbookEntriesSync();
      const entryIndex = entries.findIndex(e => e.userId === userId && e.word === word);
      
      if (entryIndex >= 0) {
        entries[entryIndex] = {
          ...entries[entryIndex],
          mastered,
          lastReviewedAt: new Date(),
          reviewCount: entries[entryIndex].reviewCount + 1
        };
        localStorage.setItem(this.STORAGE_KEYS.WORDBOOK, JSON.stringify(entries));
      }
    } catch (error) {
      console.error('更新单词状态失败:', error);
      throw error;
    }
  }

  // 删除单词本中的单词
  static async removeFromWordbook(userId: string, word: string): Promise<void> {
    try {
      const entries = this.getWordbookEntriesSync();
      const filteredEntries = entries.filter(e => !(e.userId === userId && e.word === word));
      localStorage.setItem(this.STORAGE_KEYS.WORDBOOK, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('删除单词失败:', error);
      throw error;
    }
  }

  // 保存导入历史
  static async saveHistory(history: WordImportHistory): Promise<number> {
    try {
      const histories = this.getHistoriesSync();
      const newHistory = {
        ...history,
        id: Date.now(),
        created_at: new Date()
      };
      histories.push(newHistory);
      localStorage.setItem(this.STORAGE_KEYS.IMPORT_HISTORY, JSON.stringify(histories));
      return newHistory.id;
    } catch (error) {
      console.error('保存历史记录失败:', error);
      throw error;
    }
  }

  // 获取历史记录列表
  static async getHistoryList(limit: number = 100): Promise<WordImportHistory[]> {
    try {
      const histories = this.getHistoriesSync();
      return histories
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('获取历史记录失败:', error);
      throw error;
    }
  }

  private static getHistoriesSync(): WordImportHistory[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.IMPORT_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  // 删除历史记录
  static async deleteHistory(id: number): Promise<boolean> {
    try {
      const histories = this.getHistoriesSync();
      const filteredHistories = histories.filter(h => h.id !== id);
      localStorage.setItem(this.STORAGE_KEYS.IMPORT_HISTORY, JSON.stringify(filteredHistories));
      return true;
    } catch (error) {
      console.error('删除历史记录失败:', error);
      throw error;
    }
  }

  // 获取统计信息
  static async getStatistics(): Promise<HistoryStats> {
    try {
      const histories = this.getHistoriesSync();
      
      const totalRecords = histories.length;
      const totalWords = histories.reduce((sum, h) => sum + h.word_count, 0);
      
      // 来源分布
      const sourceDistribution: { [key: string]: number } = {};
      histories.forEach(h => {
        sourceDistribution[h.source_type] = (sourceDistribution[h.source_type] || 0) + 1;
      });
      
      // 最近活动（过去7天）
      const recentActivity: { date: string; count: number }[] = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = histories.filter(h => {
          const historyDate = new Date(h.created_at).toISOString().split('T')[0];
          return historyDate === dateStr;
        }).length;
        
        recentActivity.push({ date: dateStr, count });
      }
      
      return {
        totalRecords,
        totalWords,
        sourceDistribution,
        recentActivity
      };
    } catch (error) {
      console.error('获取统计信息失败:', error);
      throw error;
    }
  }
}

// 历史记录工具类
export class HistoryUtils {
  // 解析存储的内容为单词数组
  static parseStoredContent(content: string): import('../types').Word[] {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      console.error('解析历史记录内容失败:', error);
      return [];
    }
  }

  // 格式化历史记录用于显示
  static formatHistoryForDisplay(history: WordImportHistory) {
    const createdAt = new Date(history.created_at).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const sourceNames = {
      file: '文件导入',
      manual: '手动输入',
      random: '随机生成',
      textbook: '教材词汇',
      web: '网络导入',
      pdf: 'PDF导入',
      ocr: 'OCR识别'
    };

    return {
      title: history.title,
      subtitle: sourceNames[history.source_type] || history.source_type,
      wordCount: history.word_count,
      createdAt
    };
  }

  // 将单词数组转换为存储格式
  static convertWordsToStorageFormat(words: import('../types').Word[]): string {
    return JSON.stringify(words);
  }
} 