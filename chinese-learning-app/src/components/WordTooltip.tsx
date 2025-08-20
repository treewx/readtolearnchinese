import React, { useEffect } from 'react';
import { WordInfo } from '../utils/pinyinTranslation';
import { useSpeech } from '../hooks/useSpeech';
import './WordTooltip.css';

interface WordTooltipProps {
  word: string;
  wordInfo: WordInfo;
  onSave?: (word: string, level: number, pinyin?: string, translation?: string) => void;
  savedLevel?: number;
  autoSpeakEnabled?: boolean;
}

const WordTooltip: React.FC<WordTooltipProps> = ({ word, wordInfo, onSave, savedLevel, autoSpeakEnabled }) => {
  const { speak, isSpeaking } = useSpeech();
  
  // Auto-speak when tooltip appears if enabled
  useEffect(() => {
    if (autoSpeakEnabled && wordInfo.word) {
      speak(wordInfo.word, { rate: 0.7 });
    }
  }, [autoSpeakEnabled, wordInfo.word, speak]);
  
  const handleSaveWord = (level: number) => {
    if (onSave) {
      onSave(word, level, wordInfo.pinyin, wordInfo.translation);
    }
  };

  const handleSpeak = () => {
    speak(wordInfo.word, { rate: 0.7 });
  };

  return (
    <div className="word-tooltip">
      <div className="tooltip-header">
        <div className="word-and-speech">
          <span className="tooltip-word">{wordInfo.word}</span>
          <button 
            className={`speak-word-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={handleSpeak}
            title="Pronounce word"
          >
            🔊
          </button>
        </div>
        <span className="tooltip-pinyin">{wordInfo.pinyin}</span>
      </div>
      
      <div className="tooltip-translation">
        {wordInfo.translation}
      </div>
      
      <div className="tooltip-actions">
        <div className="save-section">
          <span className="save-label">Save to vocabulary:</span>
          <div className="level-buttons">
            <button 
              className={`level-button level-1 ${savedLevel === 1 ? 'active' : ''}`}
              onClick={() => handleSaveWord(1)}
              title="Beginner level"
            >
              Level 1
            </button>
            <button 
              className={`level-button level-2 ${savedLevel === 2 ? 'active' : ''}`}
              onClick={() => handleSaveWord(2)}
              title="Intermediate level"
            >
              Level 2
            </button>
            <button 
              className={`level-button level-3 ${savedLevel === 3 ? 'active' : ''}`}
              onClick={() => handleSaveWord(3)}
              title="Advanced level"
            >
              Level 3
            </button>
          </div>
        </div>
        
        {savedLevel && (
          <div className="saved-indicator">
            ✓ Saved to Level {savedLevel}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordTooltip;