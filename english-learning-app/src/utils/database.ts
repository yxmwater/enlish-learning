import mysql from 'mysql2/promise';

// 数据库连接配置
const dbConfig = {
  host: '43.143.135.107',
  port: 3306,
  user: 'test',
  password: 'testTEST_123',
  database: 'test'
};

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

export class DatabaseManager {
  private static pool: mysql.Pool;

  static async initialize() {
    try {
      this.pool = mysql.createPool(dbConfig);
      
      // 创建学习记录表
      await this.pool.execute(`
        CREATE TABLE IF NOT EXISTS learning_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId VARCHAR(50) NOT NULL,
          gameType ENUM('match', 'spell') NOT NULL,
          wordCount INT NOT NULL,
          correctCount INT NOT NULL,
          timeSpent INT NOT NULL,
          score FLOAT NOT NULL,
          evaluation TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建单词本表
      await this.pool.execute(`
        CREATE TABLE IF NOT EXISTS wordbook (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId VARCHAR(50) NOT NULL,
          word VARCHAR(100) NOT NULL,
          translation VARCHAR(200) NOT NULL,
          difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
          addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          lastReviewedAt DATETIME NULL,
          reviewCount INT DEFAULT 0,
          mastered BOOLEAN DEFAULT FALSE,
          UNIQUE KEY unique_word_per_user (userId, word)
        )
      `);

      console.log('数据库初始化成功');
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
    if (score >= ScoreStandard.EXCELLENT.min) return ScoreStandard.EXCELLENT.description;
    if (score >= ScoreStandard.GOOD.min) return ScoreStandard.GOOD.description;
    if (score >= ScoreStandard.FAIR.min) return ScoreStandard.FAIR.description;
    return ScoreStandard.POOR.description;
  }

  // 保存学习记录
  static async saveLearningRecord(record: LearningRecord): Promise<number> {
    try {
      const [result] = await this.pool.execute(
        `INSERT INTO learning_records 
        (userId, gameType, wordCount, correctCount, timeSpent, score, evaluation) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          record.userId,
          record.gameType,
          record.wordCount,
          record.correctCount,
          record.timeSpent,
          record.score,
          record.evaluation
        ]
      );
      return (result as any).insertId;
    } catch (error) {
      console.error('保存学习记录失败:', error);
      throw error;
    }
  }

  // 获取学习记录
  static async getLearningRecords(userId: string): Promise<LearningRecord[]> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM learning_records WHERE userId = ? ORDER BY timestamp DESC',
        [userId]
      );
      return rows as LearningRecord[];
    } catch (error) {
      console.error('获取学习记录失败:', error);
      throw error;
    }
  }

  // 添加单词到单词本
  static async addToWordbook(entry: WordbookEntry): Promise<void> {
    try {
      await this.pool.execute(
        `INSERT INTO wordbook 
        (userId, word, translation, difficulty) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        translation = VALUES(translation),
        difficulty = VALUES(difficulty)`,
        [entry.userId, entry.word, entry.translation, entry.difficulty]
      );
    } catch (error) {
      console.error('添加单词失败:', error);
      throw error;
    }
  }

  // 从单词本获取单词
  static async getWordbookEntries(userId: string): Promise<WordbookEntry[]> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM wordbook WHERE userId = ? ORDER BY addedAt DESC',
        [userId]
      );
      return rows as WordbookEntry[];
    } catch (error) {
      console.error('获取单词本失败:', error);
      throw error;
    }
  }

  // 更新单词掌握状态
  static async updateWordMastery(userId: string, word: string, mastered: boolean): Promise<void> {
    try {
      await this.pool.execute(
        `UPDATE wordbook 
        SET mastered = ?, 
            lastReviewedAt = CURRENT_TIMESTAMP,
            reviewCount = reviewCount + 1 
        WHERE userId = ? AND word = ?`,
        [mastered, userId, word]
      );
    } catch (error) {
      console.error('更新单词状态失败:', error);
      throw error;
    }
  }

  // 删除单词本中的单词
  static async removeFromWordbook(userId: string, word: string): Promise<void> {
    try {
      await this.pool.execute(
        'DELETE FROM wordbook WHERE userId = ? AND word = ?',
        [userId, word]
      );
    } catch (error) {
      console.error('删除单词失败:', error);
      throw error;
    }
  }
} 