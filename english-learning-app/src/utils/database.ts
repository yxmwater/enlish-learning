import mysql from 'mysql2/promise';

// 数据库配置
const DB_CONFIG = {
  host: '43.143.135.107',
  port: 3306,
  user: 'test',
  password: 'amytest',
  database: 'english_learning', // 假设数据库名为 english_learning
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000,
};

// 历史记录接口
export interface WordImportHistory {
  id?: number;
  title: string;
  content: string;
  source_type: 'file' | 'manual' | 'random' | 'textbook' | 'web' | 'pdf' | 'ocr';
  word_count: number;
  created_at?: Date;
  textbook_info?: string; // JSON字符串，存储教材信息
  metadata?: string; // JSON字符串，存储额外信息
}

// 数据库连接管理
export class DatabaseManager {
  private static connection: mysql.Connection | null = null;

  // 测试数据库连接
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const connection = await mysql.createConnection(DB_CONFIG);
      
      // 测试查询
      const [rows] = await connection.execute('SELECT 1 as test');
      
      await connection.end();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: `数据库连接失败: ${error}` 
      };
    }
  }

  // 获取数据库连接
  static async getConnection(): Promise<mysql.Connection> {
    if (!this.connection) {
      this.connection = await mysql.createConnection(DB_CONFIG);
    }
    return this.connection;
  }

  // 关闭数据库连接
  static async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  // 创建历史记录表
  static async createHistoryTable(): Promise<void> {
    const connection = await this.getConnection();
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS word_import_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source_type ENUM('file', 'manual', 'random', 'textbook', 'web', 'pdf', 'ocr') NOT NULL,
        word_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        textbook_info JSON,
        metadata JSON,
        INDEX idx_source_type (source_type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createTableSQL);
  }

  // 保存历史记录
  static async saveHistory(history: WordImportHistory): Promise<number> {
    const connection = await this.getConnection();
    
    const insertSQL = `
      INSERT INTO word_import_history 
      (title, content, source_type, word_count, textbook_info, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.execute(insertSQL, [
      history.title,
      history.content,
      history.source_type,
      history.word_count,
      history.textbook_info || null,
      history.metadata || null
    ]);
    
    return (result as mysql.ResultSetHeader).insertId;
  }

  // 获取历史记录列表
  static async getHistoryList(limit: number = 50, offset: number = 0): Promise<WordImportHistory[]> {
    const connection = await this.getConnection();
    
    const selectSQL = `
      SELECT id, title, content, source_type, word_count, created_at, textbook_info, metadata
      FROM word_import_history 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await connection.execute(selectSQL, [limit, offset]);
    
    return rows as WordImportHistory[];
  }

  // 根据ID获取历史记录
  static async getHistoryById(id: number): Promise<WordImportHistory | null> {
    const connection = await this.getConnection();
    
    const selectSQL = `
      SELECT id, title, content, source_type, word_count, created_at, textbook_info, metadata
      FROM word_import_history 
      WHERE id = ?
    `;
    
    const [rows] = await connection.execute(selectSQL, [id]);
    const results = rows as WordImportHistory[];
    
    return results.length > 0 ? results[0] : null;
  }

  // 删除历史记录
  static async deleteHistory(id: number): Promise<boolean> {
    const connection = await this.getConnection();
    
    const deleteSQL = `DELETE FROM word_import_history WHERE id = ?`;
    const [result] = await connection.execute(deleteSQL, [id]);
    
    return (result as mysql.ResultSetHeader).affectedRows > 0;
  }

  // 搜索历史记录
  static async searchHistory(keyword: string, limit: number = 20): Promise<WordImportHistory[]> {
    const connection = await this.getConnection();
    
    const searchSQL = `
      SELECT id, title, content, source_type, word_count, created_at, textbook_info, metadata
      FROM word_import_history 
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    const searchTerm = `%${keyword}%`;
    const [rows] = await connection.execute(searchSQL, [searchTerm, searchTerm, limit]);
    
    return rows as WordImportHistory[];
  }

  // 按来源类型获取历史记录
  static async getHistoryBySource(sourceType: string, limit: number = 20): Promise<WordImportHistory[]> {
    const connection = await this.getConnection();
    
    const selectSQL = `
      SELECT id, title, content, source_type, word_count, created_at, textbook_info, metadata
      FROM word_import_history 
      WHERE source_type = ?
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    const [rows] = await connection.execute(selectSQL, [sourceType, limit]);
    
    return rows as WordImportHistory[];
  }

  // 获取统计信息
  static async getStatistics(): Promise<{
    totalRecords: number;
    totalWords: number;
    sourceStats: { source_type: string; count: number }[];
  }> {
    const connection = await this.getConnection();
    
    // 总记录数和总单词数
    const [totalRows] = await connection.execute(`
      SELECT COUNT(*) as total_records, SUM(word_count) as total_words
      FROM word_import_history
    `);
    
    const totals = (totalRows as any[])[0];
    
    // 按来源类型统计
    const [sourceRows] = await connection.execute(`
      SELECT source_type, COUNT(*) as count
      FROM word_import_history
      GROUP BY source_type
      ORDER BY count DESC
    `);
    
    return {
      totalRecords: totals.total_records || 0,
      totalWords: totals.total_words || 0,
      sourceStats: sourceRows as { source_type: string; count: number }[]
    };
  }
}

// 历史记录工具函数
export class HistoryUtils {
  // 从单词列表生成标题
  static generateTitle(words: any[], sourceType: string): string {
    const count = words.length;
    const firstWords = words.slice(0, 3).map(w => w.word || w.english || '').join(', ');
    
    const sourceNames = {
      file: '文件导入',
      manual: '手动输入',
      random: '随机生成',
      textbook: '教材词汇',
      web: '网络导入',
      pdf: 'PDF导入',
      ocr: 'OCR识别'
    };
    
    const sourceName = sourceNames[sourceType as keyof typeof sourceNames] || '未知来源';
    
    if (count <= 3) {
      return `${sourceName} - ${firstWords}`;
    } else {
      return `${sourceName} - ${firstWords}等${count}个单词`;
    }
  }

  // 格式化历史记录显示
  static formatHistoryForDisplay(history: WordImportHistory): {
    title: string;
    subtitle: string;
    wordCount: number;
    sourceType: string;
    createdAt: string;
  } {
    const sourceNames = {
      file: '文件导入',
      manual: '手动输入',
      random: '随机生成',
      textbook: '教材词汇',
      web: '网络导入',
      pdf: 'PDF导入',
      ocr: 'OCR识别'
    };
    
    const sourceName = sourceNames[history.source_type as keyof typeof sourceNames] || '未知来源';
    
    return {
      title: history.title,
      subtitle: sourceName,
      wordCount: history.word_count,
      sourceType: history.source_type,
      createdAt: history.created_at ? new Date(history.created_at).toLocaleString('zh-CN') : '未知时间'
    };
  }

  // 解析存储的内容为单词列表
  static parseStoredContent(content: string): any[] {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('解析历史记录内容失败:', error);
      return [];
    }
  }
} 