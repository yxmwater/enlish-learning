import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronDown, Play, ArrowLeft } from 'lucide-react';
import { Word, TextbookData, TextbookUnit, TextbookLesson } from '../types';
import { 
  getAvailableTextbooks, 
  getAllWordsFromTextbook, 
  getWordsFromUnit, 
  getWordsFromLesson
} from '../data/textbookDatabase';
import './TextbookSelection.css';

interface TextbookSelectionProps {
  onWordsSelected: (words: Word[]) => void;
}

export const TextbookSelection: React.FC<TextbookSelectionProps> = ({ onWordsSelected }) => {
  const [selectedTextbook, setSelectedTextbook] = useState<TextbookData | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<TextbookUnit | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<TextbookLesson | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  const textbooks = getAvailableTextbooks();

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const handleTextbookSelect = (textbook: TextbookData) => {
    setSelectedTextbook(textbook);
    setSelectedUnit(null);
    setSelectedLesson(null);
    setExpandedUnits(new Set());
  };

  const handleUnitSelect = (unit: TextbookUnit) => {
    setSelectedUnit(unit);
    setSelectedLesson(null);
  };

  const handleLessonSelect = (lesson: TextbookLesson) => {
    setSelectedLesson(lesson);
  };

  const handleStartLearning = (scope: 'textbook' | 'unit' | 'lesson', unit?: TextbookUnit, lesson?: TextbookLesson) => {
    if (!selectedTextbook) return;

    let words: Word[] = [];
    
    switch (scope) {
      case 'textbook':
        words = getAllWordsFromTextbook(selectedTextbook.info.id);
        break;
      case 'unit':
        const unitToUse = unit || selectedUnit;
        if (unitToUse) {
          words = getWordsFromUnit(selectedTextbook.info.id, unitToUse.id);
        }
        break;
      case 'lesson':
        const unitForLesson = unit || selectedUnit;
        const lessonToUse = lesson || selectedLesson;
        if (unitForLesson && lessonToUse) {
          words = getWordsFromLesson(selectedTextbook.info.id, unitForLesson.id, lessonToUse.id);
        }
        break;
    }

    if (words.length > 0) {
      console.log(`Selected ${words.length} words for ${scope}:`, words);
      onWordsSelected(words);
    } else {
      console.warn(`No words found for ${scope}`);
    }
  };

  const goBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
    } else if (selectedUnit) {
      setSelectedUnit(null);
    } else if (selectedTextbook) {
      setSelectedTextbook(null);
    }
  };

  return (
    <div className="textbook-selection">
      <div className="textbook-header">
        <BookOpen size={32} className="textbook-icon" />
        <div className="textbook-title">
          <h2>教材词汇库</h2>
          <p>选择教材版本进行针对性学习</p>
        </div>
      </div>

      {/* 面包屑导航 */}
      {(selectedTextbook || selectedUnit || selectedLesson) && (
        <div className="breadcrumb">
          <button className="breadcrumb-back" onClick={goBack}>
            <ArrowLeft size={16} />
            返回
          </button>
          <div className="breadcrumb-path">
            {selectedTextbook && (
              <span className="breadcrumb-item">{selectedTextbook.info.name}</span>
            )}
            {selectedUnit && (
              <>
                <ChevronRight size={16} />
                <span className="breadcrumb-item">{selectedUnit.name}</span>
              </>
            )}
            {selectedLesson && (
              <>
                <ChevronRight size={16} />
                <span className="breadcrumb-item">{selectedLesson.name}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 教材选择 */}
      {!selectedTextbook && (
        <motion.div
          className="textbook-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {textbooks.map((textbook) => (
            <motion.div
              key={textbook.info.id}
              className="textbook-card"
              onClick={() => handleTextbookSelect(textbook)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="textbook-info">
                <h3>{textbook.info.name}</h3>
                <div className="textbook-meta">
                  <span className="publisher">{textbook.info.publisher}</span>
                  <span className="grade">{textbook.info.grade} {textbook.info.semester}</span>
                  <span className="region">{textbook.info.region}</span>
                </div>
                <p className="textbook-description">{textbook.info.description}</p>
                <div className="textbook-stats">
                  <span>{textbook.units.length} 个单元</span>
                  <span>{textbook.units.reduce((acc, unit) => acc + unit.lessons.length, 0)} 个课程</span>
                  <span>{getAllWordsFromTextbook(textbook.info.id).length} 个单词</span>
                </div>
              </div>
              <ChevronRight size={24} className="textbook-arrow" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 单元选择 */}
      {selectedTextbook && !selectedUnit && (
        <motion.div
          className="unit-selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="selection-header">
            <h3>{selectedTextbook.info.name}</h3>
            <button 
              className="start-all-btn"
              onClick={() => handleStartLearning('textbook')}
            >
              <Play size={16} />
              学习全部单词 ({getAllWordsFromTextbook(selectedTextbook.info.id).length}个)
            </button>
          </div>

          <div className="unit-list">
            {selectedTextbook.units.map((unit) => (
              <div key={unit.id} className="unit-item">
                <div 
                  className="unit-header"
                  onClick={() => toggleUnit(unit.id)}
                >
                  <div className="unit-info">
                    <h4>{unit.name}</h4>
                    <p>{unit.description}</p>
                    <span className="unit-stats">
                      {unit.lessons.length} 个课程 • {getWordsFromUnit(selectedTextbook.info.id, unit.id).length} 个单词
                    </span>
                  </div>
                  <div className="unit-actions">
                    <button 
                      className="unit-start-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnitSelect(unit);
                        handleStartLearning('unit', unit);
                      }}
                    >
                      <Play size={14} />
                      学习本单元
                    </button>
                    <button className="unit-expand-btn">
                      {expandedUnits.has(unit.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>
                </div>

                {expandedUnits.has(unit.id) && (
                  <motion.div
                    className="lesson-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {unit.lessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className="lesson-item"
                        onClick={() => {
                          handleUnitSelect(unit);
                          handleLessonSelect(lesson);
                          handleStartLearning('lesson', unit, lesson);
                        }}
                      >
                        <div className="lesson-info">
                          <h5>{lesson.name}</h5>
                          <p>{lesson.description}</p>
                          <span className="lesson-stats">{lesson.words.length} 个单词</span>
                        </div>
                        <Play size={16} className="lesson-play" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}; 