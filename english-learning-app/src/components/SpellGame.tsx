import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, SkipForward } from 'lucide-react';
import { Word } from '../types';
import { DatabaseManager } from '../utils/database';
import './SpellGame.css';

interface SpellGameProps {
  words: Word[];
  onComplete: () => void;
  userId: string;  // 添加用户ID
}

export const SpellGame: React.FC<SpellGameProps> = ({ words, onComplete, userId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [difficultWords, setDifficultWords] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const speakWord = () => {
    if ('speechSynthesis' in window && currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.english);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    const correct = userInput.trim().toLowerCase() === currentWord.english.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(attempts + 1);

    if (correct) {
      setScore(score + 1);
    } else {
      // 添加到困难单词列表
      if (!difficultWords.includes(currentWord.id)) {
        setDifficultWords([...difficultWords, currentWord.id]);
      }
    }

    setTimeout(() => {
      if (correct || attempts >= 2) {
        nextWord();
      } else {
        setShowFeedback(false);
        setUserInput('');
      }
    }, correct ? 1500 : 2000);
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setShowFeedback(false);
      setAttempts(0);
    } else {
      setGameComplete(true);
      saveLearningRecord();
    }
  };

  const skipWord = () => {
    // 添加到困难单词列表
    if (!difficultWords.includes(currentWord.id)) {
      setDifficultWords([...difficultWords, currentWord.id]);
    }
    nextWord();
  };

  const saveLearningRecord = async () => {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = DatabaseManager.calculateScore(score, words.length, timeSpent);
      const evaluation = DatabaseManager.getEvaluation(finalScore);

      await DatabaseManager.saveLearningRecord({
        userId,
        gameType: 'spell',
        wordCount: words.length,
        correctCount: score,
        timeSpent,
        score: finalScore,
        evaluation,
        timestamp: new Date()
      });

      // 将困难单词添加到单词本
      for (const wordId of difficultWords) {
        const word = words.find(w => w.id === wordId);
        if (word) {
          await DatabaseManager.addToWordbook({
            userId,
            word: word.english,
            translation: word.chinese || '',
            difficulty: 'hard',
            addedAt: new Date(),
            lastReviewedAt: null,
            reviewCount: 0,
            mastered: false
          });
        }
      }
    } catch (error) {
      console.error('保存学习记录失败:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim() && !showFeedback) {
      checkAnswer();
    }
  };

  return (
    <div className="spell-game">
      {!gameComplete ? (
        <>
          <div className="game-header">
            <div className="progress">
              <div className="progress-text">
                {currentIndex + 1} / {words.length}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="score">
              得分: {score}
            </div>
          </div>

          <div className="game-content">
            <div className="word-section">
              <div className="chinese-hint">{currentWord.chinese}</div>
              <button className="speak-button" onClick={speakWord}>
                点击听发音
              </button>
            </div>

            <div className="input-section">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入英文单词"
                className={`spell-input ${showFeedback ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                disabled={showFeedback}
              />
              
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {isCorrect ? (
                      <>
                        <Check size={24} />
                        <span>正确!</span>
                      </>
                    ) : (
                      <>
                        <X size={24} />
                        <span>正确答案: {currentWord.english}</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="spell-actions">
              <button
                className="check-button"
                onClick={checkAnswer}
                disabled={!userInput.trim() || showFeedback}
              >
                检查答案
              </button>
              <button
                className="skip-button"
                onClick={skipWord}
                disabled={showFeedback}
              >
                <SkipForward size={20} />
                跳过
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="game-complete">
          <h2>游戏完成！</h2>
          <div className="complete-stats">
            <div className="stat">
              <span className="label">总单词数</span>
              <span className="value">{words.length}</span>
            </div>
            <div className="stat">
              <span className="label">正确数</span>
              <span className="value">{score}</span>
            </div>
            <div className="stat">
              <span className="label">正确率</span>
              <span className="value">{Math.round((score / words.length) * 100)}%</span>
            </div>
          </div>
          <div className="complete-actions">
            <button onClick={onComplete}>返回主页</button>
          </div>
        </div>
      )}
    </div>
  );
};