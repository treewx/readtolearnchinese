import React, { useState } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import './VocabularyManager.css';

const VocabularyManager: React.FC = () => {
  const { vocabulary, removeWord, clearVocabulary, getWordsByLevel } = useVocabulary();
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);

  const levelColors: { [key: number]: { bg: string; border: string; text: string } } = {
    1: { bg: '#e8f5e8', border: '#4CAF50', text: '#2e7d32' },
    2: { bg: '#fff3e0', border: '#FF9800', text: '#ef6c00' },
    3: { bg: '#ffebee', border: '#F44336', text: '#c62828' }
  };

  const getLevelName = (level: number): string => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const handleRemoveWord = (word: string) => {
    if (window.confirm(`Are you sure you want to remove "${word}" from your vocabulary?`)) {
      removeWord(word);
    }
  };

  const handleClearVocabulary = () => {
    if (showConfirmClear) {
      clearVocabulary();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      setTimeout(() => setShowConfirmClear(false), 3000);
    }
  };

  const exportVocabulary = () => {
    const dataStr = JSON.stringify(vocabulary, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chinese-vocabulary-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const currentLevelWords = getWordsByLevel(activeLevel);
  const totalWords = vocabulary.length;

  return (
    <div className="vocabulary-manager">
      <div className="vocabulary-header">
        <h2>📚 Vocabulary Manager</h2>
        <div className="vocabulary-stats">
          <span className="total-words">Total: {totalWords} words</span>
          <div className="level-stats">
            {[1, 2, 3].map(level => (
              <span key={level} className={`level-stat level-${level}`}>
                Level {level}: {getWordsByLevel(level).length}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="vocabulary-controls">
        <div className="level-tabs">
          {[1, 2, 3].map(level => (
            <button
              key={level}
              className={`level-tab ${activeLevel === level ? 'active' : ''}`}
              style={{
                backgroundColor: activeLevel === level ? levelColors[level].bg : 'white',
                borderColor: levelColors[level].border,
                color: levelColors[level].text
              }}
              onClick={() => setActiveLevel(level)}
            >
              {getLevelName(level)} ({getWordsByLevel(level).length})
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button className="export-button" onClick={exportVocabulary}>
            Export Vocabulary
          </button>
          <button 
            className={`clear-button ${showConfirmClear ? 'confirm' : ''}`}
            onClick={handleClearVocabulary}
          >
            {showConfirmClear ? 'Click again to confirm' : 'Clear All'}
          </button>
        </div>
      </div>

      <div className="vocabulary-content">
        {currentLevelWords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No words in {getLevelName(activeLevel)} level yet</h3>
            <p>To get started:</p>
            <ol>
              <li>Enter Chinese text above and click "Segment and Convert"</li>
              <li>Hover over words to see details</li>
              <li>Use the level buttons in tooltips to save words here</li>
            </ol>
          </div>
        ) : (
          <div className="words-grid">
            {currentLevelWords.map((vocabWord, index) => (
              <div 
                key={index} 
                className="vocabulary-word-card"
                style={{
                  backgroundColor: levelColors[vocabWord.level].bg,
                  borderColor: levelColors[vocabWord.level].border
                }}
              >
                <div className="word-main">
                  <span className="word-text">{vocabWord.word}</span>
                  <button 
                    className="remove-word-btn"
                    onClick={() => handleRemoveWord(vocabWord.word)}
                    title="Remove word"
                  >
                    ×
                  </button>
                </div>
                <div className="word-meta">
                  <span className="date-added">
                    Added: {new Date(vocabWord.dateAdded).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalWords > 0 && (
        <div className="vocabulary-footer">
          <p className="vocabulary-tip">
            💡 Tip: Words are automatically highlighted in the text when you save them to your vocabulary!
          </p>
        </div>
      )}
    </div>
  );
};

export default VocabularyManager;