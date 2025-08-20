import React, { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import './SpeechControls.css';

interface SpeechControlsProps {
  text?: string;
  words?: string[];
  className?: string;
  onAutoSpeakChange?: (enabled: boolean) => void;
  autoSpeakEnabled?: boolean;
}

const SpeechControls: React.FC<SpeechControlsProps> = ({ 
  text, 
  words, 
  className = '', 
  onAutoSpeakChange,
  autoSpeakEnabled: propAutoSpeakEnabled 
}) => {
  const { speak, stop, isSpeaking, isSupported, voices, selectedVoice, setSelectedVoice } = useSpeech();
  const [showVoiceSelector, setShowVoiceSelector] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.8);
  const [localAutoSpeakEnabled, setLocalAutoSpeakEnabled] = useState<boolean>(false);
  
  // Use prop value if provided, otherwise use local state
  const autoSpeakEnabled = propAutoSpeakEnabled !== undefined ? propAutoSpeakEnabled : localAutoSpeakEnabled;

  if (!isSupported) {
    return (
      <div className={`speech-controls not-supported ${className}`}>
        <p>Speech synthesis not supported in this browser</p>
      </div>
    );
  }

  const handleSpeakText = () => {
    if (text) {
      speak(text, { rate: speechRate });
    }
  };

  const handleSpeakWords = () => {
    if (words && words.length > 0) {
      const textToSpeak = words.join('，'); // Join with Chinese comma
      speak(textToSpeak, { rate: speechRate });
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceIndex = parseInt(event.target.value);
    if (voiceIndex >= 0 && voiceIndex < voices.length) {
      setSelectedVoice(voices[voiceIndex]);
    }
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechRate(parseFloat(event.target.value));
  };

  const getChineseVoices = () => {
    return voices.filter(voice => 
      voice.lang.includes('zh') || 
      voice.lang.includes('cmn') ||
      voice.name.toLowerCase().includes('chinese') ||
      voice.name.toLowerCase().includes('mandarin')
    );
  };

  const chineseVoices = getChineseVoices();

  return (
    <div className={`speech-controls ${className}`}>
      <h3 className="speech-title">🔊 Controls</h3>
      <div className="speech-buttons">
        {text && (
          <button 
            className={`speech-button speak-text ${isSpeaking ? 'speaking' : ''}`}
            onClick={isSpeaking ? handleStop : handleSpeakText}
            disabled={!text.trim()}
            title={isSpeaking ? 'Stop speaking' : 'Speak full text'}
          >
            {isSpeaking ? (
              <>
                <span className="icon">⏹️</span>
                Stop
              </>
            ) : (
              <>
                <span className="icon">🔊</span>
                Speak Text
              </>
            )}
          </button>
        )}

        {words && words.length > 0 && (
          <button 
            className={`speech-button speak-words ${isSpeaking ? 'speaking' : ''}`}
            onClick={isSpeaking ? handleStop : handleSpeakWords}
            title={isSpeaking ? 'Stop speaking' : 'Speak segmented words'}
          >
            {isSpeaking ? (
              <>
                <span className="icon">⏹️</span>
                Stop
              </>
            ) : (
              <>
                <span className="icon">🎵</span>
                Speak Words
              </>
            )}
          </button>
        )}

        <button 
          className={`speech-button auto-speak ${autoSpeakEnabled ? 'enabled' : 'disabled'}`}
          onClick={() => {
            const newValue = !autoSpeakEnabled;
            if (onAutoSpeakChange) {
              onAutoSpeakChange(newValue);
            } else {
              setLocalAutoSpeakEnabled(newValue);
            }
          }}
          title={`Auto-speak words: ${autoSpeakEnabled ? 'ON' : 'OFF'}`}
        >
          <span className="icon">{autoSpeakEnabled ? '🔊' : '🔇'}</span>
          Auto Speak: {autoSpeakEnabled ? 'ON' : 'OFF'}
        </button>

        <button 
          className="speech-button settings"
          onClick={() => setShowVoiceSelector(!showVoiceSelector)}
          title="Speech settings"
        >
          <span className="icon">⚙️</span>
          Settings
        </button>

      </div>

      {showVoiceSelector && (
        <div className="speech-settings">
          <div className="setting-group">
            <label htmlFor="voice-select">Voice:</label>
            <select 
              id="voice-select"
              value={selectedVoice ? voices.indexOf(selectedVoice) : -1}
              onChange={handleVoiceChange}
            >
              <option value={-1}>Default</option>
              {chineseVoices.length > 0 && (
                <optgroup label="Chinese Voices">
                  {chineseVoices.map((voice, index) => (
                    <option key={voice.name} value={voices.indexOf(voice)}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </optgroup>
              )}
              {voices.filter(voice => !chineseVoices.includes(voice)).length > 0 && (
                <optgroup label="Other Voices">
                  {voices.filter(voice => !chineseVoices.includes(voice)).map((voice) => (
                    <option key={voice.name} value={voices.indexOf(voice)}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="rate-slider">Speech Rate: {speechRate.toFixed(1)}x</label>
            <input
              id="rate-slider"
              type="range"
              min="0.3"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={handleRateChange}
            />
          </div>

          {selectedVoice && (
            <div className="voice-info">
              <p>Selected: {selectedVoice.name} ({selectedVoice.lang})</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SpeechControls;