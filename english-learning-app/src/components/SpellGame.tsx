import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Check, X, SkipForward, Trophy } from 'lucide-react';
import { Word } from '../types';
import './SpellGame.css';

interface SpellGameProps {
  words: Word[];
  onComplete: () => void;
}

export const SpellGame: React.FC<SpellGameProps> = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
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
    }
  };

  const skipWord = () => {
    nextWord();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim() && !showFeedback) {
      checkAnswer();
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setUserInput('');
    setShowFeedback(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
  };

  const accuracy = words.length > 0 ? Math.round((score / words.length) * 100) : 0;

  return (
    <div className="spell-game">
      {!gameComplete ? (
        <>
          <div className="spell-header">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              />
            </div>
            <div className="spell-stats">
              <span>单词 {currentIndex + 1}/{words.length}</span>
              <span>得分: {score}</span>
            </div>
          </div>

          <div className="spell-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="word-display"
              >
                {currentWord.chinese && (
                  <div className="word-chinese">{currentWord.chinese}</div>
                )}
                {currentWord.pronunciation && (
                  <div className="word-pronunciation">[{currentWord.pronunciation}]</div>
                )}
                
                <button className="speak-button" onClick={speakWord}>
                  <Volume2 size={32} />
                  <span>播放发音</span>
                </button>

                {attempts > 0 && !isCorrect && (
                  <div className="hint">
                    提示: {currentWord.english.substring(0, Math.min(3, currentWord.english.length))}...
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

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
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Trophy size={64} className="trophy-icon" />
          <h2>练习完成！</h2>
          <div className="final-stats">
            <div className="stat-item">
              <span className="stat-label">正确单词</span>
              <span className="stat-value">{score}/{words.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">正确率</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
          </div>
          <div className="complete-actions">
            <button onClick={restartGame} className="action-button">
              重新练习
            </button>
            <button onClick={onComplete} className="action-button primary">
              返回主页
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};