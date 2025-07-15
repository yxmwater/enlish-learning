import React, { useState } from 'react';
import { Shuffle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRandomWords } from '../data/wordDatabase';
import { Word } from '../types';
import './RandomWords.css';

interface RandomWordsProps {
  onWordsGenerated: (words: Word[]) => void;
}

export const RandomWords: React.FC<RandomWordsProps> = ({ onWordsGenerated }) => {
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'mixed'>('beginner');
  const [count, setCount] = useState(30);

  const generateWords = () => {
    const words = getRandomWords(level, count);
    onWordsGenerated(words);
  };

  return (
    <motion.div
      className="random-words"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="random-header">
        <Shuffle size={32} className="random-icon" />
        <h2 className="random-title">随机生成单词</h2>
      </div>
      
      <div className="random-controls">
        <div className="control-group">
          <label className="control-label">难度级别</label>
          <div className="level-buttons">
            {(['beginner', 'intermediate', 'advanced', 'mixed'] as const).map((lvl) => (
              <motion.button
                key={lvl}
                className={`level-button ${level === lvl ? 'active' : ''}`}
                onClick={() => setLevel(lvl)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {lvl === 'beginner' && '初级'}
                {lvl === 'intermediate' && '中级'}
                {lvl === 'advanced' && '高级'}
                {lvl === 'mixed' && '混合'}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="control-group">
          <label className="control-label">单词数量</label>
          <div className="count-control">
            <input
              type="range"
              min="10"
              max="50"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="count-slider"
            />
            <span className="count-value">{count}</span>
          </div>
        </div>
      </div>
      
      <motion.button
        className="generate-button"
        onClick={generateWords}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Zap size={20} />
        生成单词列表
      </motion.button>
      
      <div className="level-info">
        {level === 'beginner' && (
          <p>初级单词：包含日常生活中最常用的基础词汇</p>
        )}
        {level === 'intermediate' && (
          <p>中级单词：包含更复杂的词汇，适合有一定基础的学习者</p>
        )}
        {level === 'advanced' && (
          <p>高级单词：包含学术和专业领域的高级词汇</p>
        )}
        {level === 'mixed' && (
          <p>混合模式：包含各个级别的单词，适合综合练习</p>
        )}
      </div>
    </motion.div>
  );
};