import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Play, 
  Calendar,
  FileText,
  Upload,
  Shuffle,
  BookOpen,
  Globe,
  Camera,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DatabaseManager, WordImportHistory, HistoryUtils } from '../utils/database';
import { Word } from '../types';
import './HistoryManager.css';

interface HistoryManagerProps {
  onSelectHistory: (words: Word[]) => void;
  onClose: () => void;
}

interface HistoryStats {
  totalRecords: number;
  totalWords: number;
  sourceStats: { source_type: string; count: number }[];
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({ onSelectHistory, onClose }) => {
  const [histories, setHistories] = useState<WordImportHistory[]>([]);
  const [filteredHistories, setFilteredHistories] = useState<WordImportHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [showStats, setShowStats] = useState(false);

  // 来源类型图标映射
  const sourceIcons = {
    file: Upload,
    manual: FileText,
    random: Shuffle,
    textbook: BookOpen,
    web: Globe,
    pdf: FileText,
    ocr: Camera
  };

  // 来源类型名称映射
  const sourceNames = {
    file: '文件导入',
    manual: '手动输入',
    random: '随机生成',
    textbook: '教材词汇',
    web: '网络导入',
    pdf: 'PDF导入',
    ocr: 'OCR识别'
  };

  // 加载历史记录
  const loadHistories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const historyList = await DatabaseManager.getHistoryList(100);
      setHistories(historyList);
      setFilteredHistories(historyList);
      
      // 加载统计信息
      const statistics = await DatabaseManager.getStatistics();
      setStats(statistics);
      
    } catch (err) {
      setError(`加载历史记录失败: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤历史记录
  const filterHistories = () => {
    let filtered = histories;
    
    // 按来源类型过滤
    if (selectedSource !== 'all') {
      filtered = filtered.filter(h => h.source_type === selectedSource);
    }
    
    // 按搜索词过滤
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(h => 
        h.title.toLowerCase().includes(term) ||
        h.content.toLowerCase().includes(term)
      );
    }
    
    setFilteredHistories(filtered);
  };

  // 删除历史记录
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这条历史记录吗？')) {
      return;
    }
    
    try {
      const success = await DatabaseManager.deleteHistory(id);
      if (success) {
        await loadHistories(); // 重新加载
      } else {
        alert('删除失败');
      }
    } catch (err) {
      alert(`删除失败: ${err}`);
    }
  };

  // 选择历史记录进行学习
  const handleSelectHistory = async (history: WordImportHistory) => {
    try {
      const words = HistoryUtils.parseStoredContent(history.content);
      onSelectHistory(words);
      onClose();
    } catch (err) {
      alert(`加载历史记录失败: ${err}`);
    }
  };

  // 初始化
  useEffect(() => {
    loadHistories();
  }, []);

  // 搜索和过滤
  useEffect(() => {
    filterHistories();
  }, [searchTerm, selectedSource, histories]);

  return (
    <motion.div 
      className="history-manager-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="history-manager"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* 头部 */}
        <div className="history-header">
          <div className="header-left">
            <History size={24} />
            <div>
              <h2>学习历史</h2>
              <p>选择之前导入的内容继续学习</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="stats-btn"
              onClick={() => setShowStats(!showStats)}
            >
              <BarChart3 size={16} />
              统计
            </button>
            <button 
              className="refresh-btn"
              onClick={loadHistories}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
              刷新
            </button>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <AnimatePresence>
          {showStats && stats && (
            <motion.div 
              className="stats-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{stats.totalRecords}</div>
                  <div className="stat-label">总记录数</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{stats.totalWords}</div>
                  <div className="stat-label">总单词数</div>
                </div>
                <div className="stat-sources">
                  <div className="stat-label">来源分布</div>
                  <div className="source-stats">
                    {stats.sourceStats.map(stat => (
                      <div key={stat.source_type} className="source-stat">
                        <span>{sourceNames[stat.source_type as keyof typeof sourceNames]}</span>
                        <span>{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 搜索和过滤 */}
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="搜索历史记录..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-box">
            <Filter size={16} />
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="all">全部来源</option>
              {Object.entries(sourceNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 历史记录列表 */}
        <div className="history-content">
          {isLoading ? (
            <div className="loading-state">
              <RefreshCw className="spinning" size={32} />
              <p>加载中...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={32} />
              <p>{error}</p>
              <button onClick={loadHistories}>重试</button>
            </div>
          ) : filteredHistories.length === 0 ? (
            <div className="empty-state">
              <History size={48} />
              <p>
                {searchTerm || selectedSource !== 'all' 
                  ? '没有找到匹配的记录' 
                  : '还没有学习历史记录'
                }
              </p>
            </div>
          ) : (
            <div className="history-list">
              <AnimatePresence>
                {filteredHistories.map((history, index) => {
                  const formatted = HistoryUtils.formatHistoryForDisplay(history);
                  const IconComponent = sourceIcons[history.source_type as keyof typeof sourceIcons];
                  
                  return (
                    <motion.div
                      key={history.id}
                      className="history-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="history-icon">
                        <IconComponent size={20} />
                      </div>
                      
                      <div className="history-info">
                        <div className="history-title">{formatted.title}</div>
                        <div className="history-meta">
                          <span className="history-source">{formatted.subtitle}</span>
                          <span className="history-count">{formatted.wordCount} 个单词</span>
                          <span className="history-date">{formatted.createdAt}</span>
                        </div>
                      </div>
                      
                      <div className="history-actions">
                        <button 
                          className="play-btn"
                          onClick={() => handleSelectHistory(history)}
                          title="开始学习"
                        >
                          <Play size={16} />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(history.id!)}
                          title="删除记录"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}; 