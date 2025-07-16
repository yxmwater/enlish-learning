import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Eye, Brain } from 'lucide-react';
import { Word } from '../types';
import { playMatchSound, playFlipSound, playSuccessSound } from '../utils/soundEffects';
import './MatchGame.css';

interface MatchGameProps {
  words: Word[];
  onComplete: () => void;
}

interface GameCard {
  id: string;
  wordId: string;
  content: string;
  type: 'english' | 'chinese';
  isFlipped: boolean;
  isMatched: boolean;
}

export const MatchGame: React.FC<MatchGameProps> = ({ words, onComplete }) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameComplete, setGameComplete] = useState(false);
  const [isVisualMode, setIsVisualMode] = useState(true);  // 默认为视觉学习模式

  // Initialize game cards
  useEffect(() => {
    initializeGame();
  }, [words, isVisualMode]);

  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    const wordsToUse = words.slice(0, 8); // Use first 8 words for a 4x4 grid

    if (isVisualMode) {
      // 视觉学习模式：每对卡片一个显示英文，一个显示中文
      wordsToUse.forEach((word) => {
        // 英文卡片
        gameCards.push({
          id: `en-${word.id}`,
          wordId: word.id,
          content: word.english,
          type: 'english',
          isFlipped: true, // 直接显示内容
          isMatched: false
        });

        // 中文卡片
        gameCards.push({
          id: `ch-${word.id}`,
          wordId: word.id,
          content: word.chinese || word.english,
          type: 'chinese',
          isFlipped: true, // 直接显示内容
          isMatched: false
        });
      });
    } else {
      // 记忆训练模式：英文和中文分开，需要翻牌
      wordsToUse.forEach((word) => {
        gameCards.push({
          id: `en-${word.id}`,
          wordId: word.id,
          content: word.english,
          type: 'english',
          isFlipped: false,
          isMatched: false
        });

        gameCards.push({
          id: `ch-${word.id}`,
          wordId: word.id,
          content: word.chinese || word.english,
          type: 'chinese',
          isFlipped: false,
          isMatched: false
        });
      });
    }

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  // Handle card click
  const handleCardClick = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched) return;
    
    // 在记忆训练模式下，如果卡片已经翻开，则不允许点击
    if (!isVisualMode && card.isFlipped) return;

    if (selectedCards.length === 2) return;

    // 只在记忆训练模式下播放翻牌音效
    if (!isVisualMode) {
      playFlipSound();
    }

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    // 在记忆训练模式下才需要翻牌动画
    if (!isVisualMode) {
      setCards(cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
    }

    // Check for match when two cards are selected
    if (newSelectedCards.length === 2) {
      setMoves(moves + 1);
      checkForMatch(newSelectedCards);
    }
  };

  // Check if two cards match
  const checkForMatch = (selectedIds: string[]) => {
    const [firstId, secondId] = selectedIds;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.wordId === secondCard.wordId && firstId !== secondId) {
      // Match found!
      playMatchSound();  // 播放匹配音效
      
      setTimeout(() => {
        setCards(cards.map(c => 
          c.wordId === firstCard.wordId ? { ...c, isMatched: true } : c
        ));
        setMatchedPairs([...matchedPairs, firstCard.wordId]);
        setSelectedCards([]);

        // Check if game is complete
        if (matchedPairs.length + 1 === words.slice(0, 8).length) {
          setGameComplete(true);
          playSuccessSound();  // 播放游戏完成音效
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        // 在记忆训练模式下才需要翻回卡片
        if (!isVisualMode) {
          setCards(cards.map(c => 
            selectedIds.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
        }
        setSelectedCards([]);
      }, 1000);
    }
  };

  // Calculate time elapsed
  const timeElapsed = useMemo(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [startTime]);

  const resetGame = () => {
    setCards([]);
    setSelectedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameComplete(false);
    initializeGame();
  };

  const toggleMode = () => {
    setIsVisualMode(!isVisualMode);
    resetGame();
  };

  return (
    <div className="match-game">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">步数</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">配对</span>
            <span className="stat-value">{matchedPairs.length}/{words.slice(0, 8).length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">时间</span>
            <span className="stat-value">{timeElapsed}</span>
          </div>
        </div>
        <div className="game-controls">
          <button className={`mode-button ${isVisualMode ? 'active' : ''}`} onClick={toggleMode}>
            {isVisualMode ? <Eye size={20} /> : <Brain size={20} />}
            {isVisualMode ? '视觉学习' : '记忆训练'}
          </button>
          <button className="reset-button" onClick={resetGame}>
            <RefreshCw size={20} />
            重新开始
          </button>
        </div>
      </div>

      <div className="game-board">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className={`game-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''} ${isVisualMode ? 'visual-mode' : ''}`}
            onClick={() => handleCardClick(card.id)}
            whileHover={!card.isMatched ? { scale: 1.05 } : {}}
            whileTap={!card.isMatched ? { scale: 0.95 } : {}}
            animate={card.isMatched ? { scale: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="card-inner">
              {!isVisualMode && (
                <div className="card-front">
                  <div className="card-pattern"></div>
                </div>
              )}
              <div className={`card-back ${isVisualMode ? 'no-transform' : ''}`}>
                <span className={`card-content ${card.type}`}>
                  {card.content}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {gameComplete && (
          <motion.div
            className="game-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="complete-content">
              <Trophy size={64} className="trophy-icon" />
              <h2>恭喜完成！</h2>
              <p>用时 {timeElapsed}，共 {moves} 步</p>
              <div className="complete-actions">
                <button onClick={resetGame} className="action-button">
                  再玩一次
                </button>
                <button onClick={onComplete} className="action-button primary">
                  返回主页
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};