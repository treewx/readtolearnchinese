import React, { useState } from 'react';
import './ChineseTextInput.css';
import { segmentChineseText, preprocessText } from '../utils/chineseSegmentation';
import { getWordsInfo, WordInfo } from '../utils/pinyinTranslation';
import { useVocabulary } from '../contexts/VocabularyContext';
import { useDisplaySettings } from '../contexts/DisplaySettingsContext';
import WordTooltip from './WordTooltip';
import SpeechControls from './SpeechControls';
import TopicGenerator from './TopicGenerator';

interface SegmentedWord {
  word: string;
  start: number;
  end: number;
  wordInfo?: WordInfo;
}

interface ChineseTextInputProps {}

const ChineseTextInput: React.FC<ChineseTextInputProps> = () => {
  const [inputText, setInputText] = useState<string>('');
  const [segmentedWords, setSegmentedWords] = useState<SegmentedWord[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { saveWord, getWordLevel } = useVocabulary();
  const { settings } = useDisplaySettings();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleSegmentAndConvert = async () => {
    if (!inputText.trim()) {
      alert('Please enter some Chinese text first.');
      return;
    }

    setIsProcessing(true);
    try {
      const preprocessedText = preprocessText(inputText);
      const segments = segmentChineseText(preprocessedText);
      
      // Get Pinyin and translations for each segment
      const words = segments.map(seg => seg.word);
      console.log(`Processing ${words.length} words with dynamic translation...`);
      
      const wordsInfo = await getWordsInfo(words);
      
      // Combine segmentation with word info
      const segmentsWithInfo: SegmentedWord[] = segments.map((segment, index) => ({
        ...segment,
        wordInfo: wordsInfo[index]
      }));
      
      setSegmentedWords(segmentsWithInfo);
      console.log('Translation complete! API translations cached for future use.');
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Error processing text. Some translations may have failed, but the text has been segmented.');
      // Still show the segmented words even if some translations failed
      const preprocessedText = preprocessText(inputText);
      const segments = segmentChineseText(preprocessedText);
      const fallbackSegments: SegmentedWord[] = segments.map(segment => ({
        ...segment,
        wordInfo: {
          word: segment.word,
          pinyin: 'Loading...',
          translation: 'Translation failed'
        }
      }));
      setSegmentedWords(fallbackSegments);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearText = () => {
    setInputText('');
    setSegmentedWords([]);
    setHoveredWord(null);
    setTooltipPosition(null);
    setTooltipVisible(false);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleWordHover = (index: number, event: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    setHoveredWord(index);
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    };
    setTooltipPosition(position);
    setTooltipVisible(true);
  };

  const handleWordLeave = () => {
    // Add a delay before hiding tooltip to allow clicking
    const timeout = setTimeout(() => {
      setHoveredWord(null);
      setTooltipPosition(null);
      setTooltipVisible(false);
    }, 300); // 300ms delay
    
    setHoverTimeout(timeout);
  };

  const handleTooltipEnter = () => {
    // Cancel hide timeout when entering tooltip
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleTooltipLeave = () => {
    // Hide tooltip immediately when leaving tooltip area
    setHoveredWord(null);
    setTooltipPosition(null);
    setTooltipVisible(false);
  };

  const handleSaveWord = (word: string, level: number) => {
    saveWord(word, level);
  };

  const handleGeneratedText = (generatedText: string) => {
    setInputText(generatedText);
    // Auto-process the generated text
    setTimeout(() => {
      handleSegmentAndConvert();
    }, 500);
  };

  return (
    <div className="chinese-text-input">
      <TopicGenerator onGeneratedText={handleGeneratedText} />
      
      <div className="input-section">
        <h2>Enter Chinese Text</h2>
        <textarea
          className="text-input"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter or paste ANY Chinese text here... App will automatically translate unknown words using live translation APIs!"
          rows={6}
          cols={50}
        />
        <div className="button-group">
          <button 
            className="segment-button primary-button"
            onClick={handleSegmentAndConvert}
            disabled={isProcessing || !inputText.trim()}
          >
            {isProcessing ? 'Translating with API...' : 'Segment and Translate'}
          </button>
          <button 
            className="clear-button secondary-button"
            onClick={handleClearText}
          >
            Clear
          </button>
        </div>
      </div>

      {segmentedWords.length > 0 && (
        <div className="output-section">
          <h2>Segmented Text {settings.practiceMode !== 'normal' && <span className="practice-mode-indicator">({settings.practiceMode.replace('-', ' ')} mode)</span>}</h2>
          <p className="instruction-text">Hover over words to see detailed information and save to vocabulary • Translations powered by real-time API</p>
          
          <SpeechControls 
            text={inputText}
            words={segmentedWords.map(seg => seg.word)}
            className="text-speech-controls"
          />
          
          <div className="segmented-text">
            {segmentedWords.map((segment, index) => {
              const savedLevel = getWordLevel(segment.word);
              return (
                <div 
                  key={index} 
                  className={`word-container ${savedLevel ? `saved-level-${savedLevel}` : ''} ${!settings.showChinese ? 'no-chinese' : ''}`}
                  onMouseEnter={(e) => handleWordHover(index, e)}
                  onMouseLeave={handleWordLeave}
                >
                  {settings.showChinese && (
                    <div className="text-segment">
                      {segment.word}
                    </div>
                  )}
                  {segment.wordInfo && (
                    <div className="word-details">
                      {settings.showPinyin && (
                        <div className="pinyin">{segment.wordInfo.pinyin}</div>
                      )}
                      {settings.showTranslation && (
                        <div className="translation">{segment.wordInfo.translation}</div>
                      )}
                    </div>
                  )}
                  {!settings.showChinese && (
                    <div className="hidden-word-placeholder">
                      <span className="word-hint">?</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="segmentation-info">
            <p>Found {segmentedWords.length} word segments</p>
            <p className="practice-info">
              {!settings.showTranslation && !settings.showPinyin ? 
                "Characters only - hover for hints!" :
                !settings.showTranslation ? 
                "Practice translation - hover for English!" :
                "All information visible"
              }
            </p>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredWord !== null && tooltipPosition && segmentedWords[hoveredWord]?.wordInfo && tooltipVisible && (
        <div 
          className="tooltip-overlay"
          style={{
            position: 'fixed',
            left: Math.max(10, Math.min(tooltipPosition.x - 140, window.innerWidth - 290)),
            top: Math.max(10, tooltipPosition.y - 220),
            zIndex: 1000,
            pointerEvents: 'auto'
          }}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          <WordTooltip
            word={segmentedWords[hoveredWord].word}
            wordInfo={segmentedWords[hoveredWord].wordInfo!}
            onSave={handleSaveWord}
            savedLevel={getWordLevel(segmentedWords[hoveredWord].word)}
          />
        </div>
      )}
    </div>
  );
};

export default ChineseTextInput;