import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload, PenTool, Shuffle, Gamepad2, Sparkles } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ManualInput } from './components/ManualInput';
import { RandomWords } from './components/RandomWords';
import { MatchGame } from './components/MatchGame';
import { SpellGame } from './components/SpellGame';
import { Word, InputMode, GameMode } from './types';
import './App.css';

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [inputMode, setInputMode] = useState<InputMode | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleWordsLoaded = (loadedWords: Word[]) => {
    setWords(loadedWords);
    setInputMode(null);
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(true);
  };

  const handleGameComplete = () => {
    setGameStarted(false);
    setGameMode(null);
  };

  const resetApp = () => {
    setWords([]);
    setInputMode(null);
    setGameMode(null);
    setGameStarted(false);
  };

  if (gameStarted && gameMode && words.length > 0) {
    return (
      <div className="app">
        <div className="app-container">
          {gameMode === 'match' ? (
            <MatchGame words={words} onComplete={handleGameComplete} />
          ) : (
            <SpellGame words={words} onComplete={handleGameComplete} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-container">
        <motion.header 
          className="app-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <BookOpen size={40} className="app-icon" />
            <h1 className="app-title">英语学习助手</h1>
            <p className="app-subtitle">通过游戏轻松学习英语单词</p>
          </div>
        </motion.header>

        <main className="app-main">
          <AnimatePresence mode="wait">
            {!inputMode && words.length === 0 && (
              <motion.div
                key="input-selection"
                className="input-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="section-title">选择单词来源</h2>
                <div className="input-options">
                  <motion.button
                    className="option-card"
                    onClick={() => setInputMode('file')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Upload size={32} />
                    <h3>上传文件</h3>
                    <p>从文件导入单词列表</p>
                  </motion.button>

                  <motion.button
                    className="option-card"
                    onClick={() => setInputMode('manual')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <PenTool size={32} />
                    <h3>手动输入</h3>
                    <p>逐个添加单词</p>
                  </motion.button>

                  <motion.button
                    className="option-card"
                    onClick={() => setInputMode('random')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Shuffle size={32} />
                    <h3>随机生成</h3>
                    <p>根据级别生成单词</p>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {inputMode === 'file' && (
              <motion.div
                key="file-upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button className="back-button" onClick={() => setInputMode(null)}>
                  ← 返回
                </button>
                <FileUpload onWordsLoaded={handleWordsLoaded} />
              </motion.div>
            )}

            {inputMode === 'manual' && (
              <motion.div
                key="manual-input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button className="back-button" onClick={() => setInputMode(null)}>
                  ← 返回
                </button>
                <ManualInput onWordsAdded={handleWordsLoaded} />
              </motion.div>
            )}

            {inputMode === 'random' && (
              <motion.div
                key="random-words"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button className="back-button" onClick={() => setInputMode(null)}>
                  ← 返回
                </button>
                <RandomWords onWordsGenerated={handleWordsLoaded} />
              </motion.div>
            )}

            {words.length > 0 && !gameStarted && (
              <motion.div
                key="game-selection"
                className="game-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="words-summary">
                  <Sparkles size={24} />
                  <span>已加载 {words.length} 个单词</span>
                  <button className="reset-link" onClick={resetApp}>
                    重新选择
                  </button>
                </div>

                <h2 className="section-title">选择学习模式</h2>
                <div className="game-options">
                  <motion.button
                    className="game-card"
                    onClick={() => startGame('match')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Gamepad2 size={48} />
                    <h3>单词消消乐</h3>
                    <p>匹配英文单词和中文释义</p>
                    <div className="game-features">
                      <span>记忆训练</span>
                      <span>视觉学习</span>
                    </div>
                  </motion.button>

                  <motion.button
                    className="game-card"
                    onClick={() => startGame('spell')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <PenTool size={48} />
                    <h3>拼写练习</h3>
                    <p>听发音，写单词</p>
                    <div className="game-features">
                      <span>听力训练</span>
                      <span>拼写练习</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
