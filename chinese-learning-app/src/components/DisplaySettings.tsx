import React, { useState } from 'react';
import { useDisplaySettings } from '../contexts/DisplaySettingsContext';
import './DisplaySettings.css';

const DisplaySettings: React.FC = () => {
  const { settings, updateSettings, setPracticeMode, resetSettings } = useDisplaySettings();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (setting: keyof typeof settings) => {
    if (typeof settings[setting] === 'boolean') {
      updateSettings({ [setting]: !settings[setting] });
    }
  };

  const practiceModesInfo = [
    {
      mode: 'normal' as const,
      name: 'Normal Mode',
      description: 'Show Chinese characters, Pinyin, and English translations',
      icon: '📚'
    },
    {
      mode: 'no-translation' as const,
      name: 'Practice Translation',
      description: 'Show Chinese and Pinyin, hide English (practice translating)',
      icon: '🇨🇳'
    },
    {
      mode: 'characters-only' as const,
      name: 'Characters Only',
      description: 'Show only Chinese characters (practice reading)',
      icon: '汉'
    },
    {
      mode: 'chinese-only' as const,
      name: 'Full Practice',
      description: 'Show only Chinese characters, no hints',
      icon: '💪'
    }
  ];

  return (
    <div className="display-settings">
      <button 
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Display Settings"
      >
        ⚙️ Display Settings
      </button>

      {isOpen && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>🎯 Practice Mode Settings</h3>
            <button 
              className="close-settings"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="practice-modes">
            <h4>Quick Practice Modes</h4>
            <div className="mode-buttons">
              {practiceModesInfo.map((mode) => (
                <button
                  key={mode.mode}
                  className={`mode-button ${settings.practiceMode === mode.mode ? 'active' : ''}`}
                  onClick={() => setPracticeMode(mode.mode)}
                  title={mode.description}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <span className="mode-name">{mode.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-settings">
            <h4>Custom Settings</h4>
            <div className="toggle-controls">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={settings.showChinese}
                  onChange={() => handleToggle('showChinese')}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  <span className="toggle-icon">汉</span>
                  Show Chinese Characters
                </span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={settings.showPinyin}
                  onChange={() => handleToggle('showPinyin')}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  <span className="toggle-icon">🔊</span>
                  Show Pinyin
                </span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={settings.showTranslation}
                  onChange={() => handleToggle('showTranslation')}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  <span className="toggle-icon">🇬🇧</span>
                  Show English Translation
                </span>
              </label>
            </div>
          </div>

          <div className="settings-actions">
            <button 
              className="reset-button"
              onClick={resetSettings}
            >
              🔄 Reset to Default
            </button>
          </div>

          <div className="current-mode-info">
            <h4>Current Mode</h4>
            <div className="mode-info">
              {practiceModesInfo.find(mode => mode.mode === settings.practiceMode)?.description || 'Custom settings'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplaySettings;