import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '../types';
import './ManualInput.css';

interface ManualInputProps {
  onWordsAdded: (words: Word[]) => void;
}

export const ManualInput: React.FC<ManualInputProps> = ({ onWordsAdded }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState({
    english: '',
    chinese: '',
    pronunciation: ''
  });

  const addWord = () => {
    if (currentWord.english.trim()) {
      const newWord: Word = {
        id: `manual-${Date.now()}-${Math.random()}`,
        english: currentWord.english.trim(),
        chinese: currentWord.chinese.trim() || undefined,
        pronunciation: currentWord.pronunciation.trim() || undefined,
        level: 'beginner'
      };
      setWords([...words, newWord]);
      setCurrentWord({ english: '', chinese: '', pronunciation: '' });
    }
  };

  const removeWord = (id: string) => {
    setWords(words.filter(word => word.id !== id));
  };

  const handleSubmit = () => {
    if (words.length > 0) {
      onWordsAdded(words);
      setWords([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addWord();
    }
  };

  return (
    <motion.div
      className="manual-input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="input-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="英文单词"
            value={currentWord.english}
            onChange={(e) => setCurrentWord({ ...currentWord, english: e.target.value })}
            onKeyPress={handleKeyPress}
            className="input-field"
          />
          <input
            type="text"
            placeholder="中文释义（可选）"
            value={currentWord.chinese}
            onChange={(e) => setCurrentWord({ ...currentWord, chinese: e.target.value })}
            onKeyPress={handleKeyPress}
            className="input-field"
          />
          <input
            type="text"
            placeholder="音标（可选）"
            value={currentWord.pronunciation}
            onChange={(e) => setCurrentWord({ ...currentWord, pronunciation: e.target.value })}
            onKeyPress={handleKeyPress}
            className="input-field"
          />
          <button
            onClick={addWord}
            className="add-button"
            disabled={!currentWord.english.trim()}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {words.length > 0 && (
          <motion.div
            className="words-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="list-title">已添加的单词 ({words.length})</h3>
            <div className="words-grid">
              {words.map((word) => (
                <motion.div
                  key={word.id}
                  className="word-item"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  layout
                >
                  <div className="word-content">
                    <span className="word-english">{word.english}</span>
                    {word.chinese && <span className="word-chinese">{word.chinese}</span>}
                    {word.pronunciation && <span className="word-pronunciation">[{word.pronunciation}]</span>}
                  </div>
                  <button
                    onClick={() => removeWord(word.id)}
                    className="remove-button"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
            <motion.button
              className="submit-button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              开始学习 ({words.length} 个单词)
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};