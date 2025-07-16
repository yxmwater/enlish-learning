import React, { useState, useEffect } from 'react';
import { DatabaseManager, WordbookEntry } from '../utils/database';
import './Wordbook.css';

interface WordbookProps {
  userId: string;
}

export const Wordbook: React.FC<WordbookProps> = ({ userId }) => {
  const [words, setWords] = useState<WordbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'mastered' | 'learning'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWords();
  }, [userId]);

  const loadWords = async () => {
    try {
      setLoading(true);
      const data = await DatabaseManager.getWordbookEntries(userId);
      setWords(data);
      setError(null);
    } catch (err) {
      setError('加载单词本失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMastery = async (word: string, mastered: boolean) => {
    try {
      await DatabaseManager.updateWordMastery(userId, word, mastered);
      await loadWords(); // 重新加载单词列表
    } catch (err) {
      console.error('更新单词状态失败:', err);
    }
  };

  const handleRemoveWord = async (word: string) => {
    if (window.confirm('确定要删除这个单词吗？')) {
      try {
        await DatabaseManager.removeFromWordbook(userId, word);
        await loadWords(); // 重新加载单词列表
      } catch (err) {
        console.error('删除单词失败:', err);
      }
    }
  };

  const filteredWords = words
    .filter(word => {
      if (filter === 'mastered') return word.mastered;
      if (filter === 'learning') return !word.mastered;
      return true;
    })
    .filter(word =>
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="wordbook">
      <div className="wordbook-header">
        <h2>单词本</h2>
        <div className="wordbook-controls">
          <input
            type="text"
            placeholder="搜索单词或释义..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              全部
            </button>
            <button
              className={`filter-button ${filter === 'mastered' ? 'active' : ''}`}
              onClick={() => setFilter('mastered')}
            >
              已掌握
            </button>
            <button
              className={`filter-button ${filter === 'learning' ? 'active' : ''}`}
              onClick={() => setFilter('learning')}
            >
              学习中
            </button>
          </div>
        </div>
      </div>

      <div className="words-list">
        {filteredWords.map((word) => (
          <div key={word.id} className="word-card">
            <div className="word-info">
              <div className="word-header">
                <h3>{word.word}</h3>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(word.difficulty) }}
                >
                  {word.difficulty === 'easy' ? '简单' : 
                   word.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
              <p className="translation">{word.translation}</p>
              <div className="word-stats">
                <span>复习次数: {word.reviewCount}</span>
                <span>·</span>
                <span>添加时间: {new Date(word.addedAt).toLocaleDateString()}</span>
                {word.lastReviewedAt && (
                  <>
                    <span>·</span>
                    <span>最后复习: {new Date(word.lastReviewedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
            <div className="word-actions">
              <button
                className={`mastery-button ${word.mastered ? 'mastered' : ''}`}
                onClick={() => handleUpdateMastery(word.word, !word.mastered)}
              >
                {word.mastered ? '已掌握' : '标记为已掌握'}
              </button>
              <button
                className="remove-button"
                onClick={() => handleRemoveWord(word.word)}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="no-words">
          <p>
            {searchTerm
              ? '没有找到匹配的单词'
              : filter === 'all'
              ? '单词本还是空的，开始添加单词吧！'
              : filter === 'mastered'
              ? '还没有已掌握的单词'
              : '没有正在学习的单词'}
          </p>
        </div>
      )}
    </div>
  );
}; 