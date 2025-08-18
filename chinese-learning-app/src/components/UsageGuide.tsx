import React, { useState } from 'react';
import './UsageGuide.css';

const UsageGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="usage-guide">
      <button 
        className="guide-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="How to use this app"
      >
        ❓ How to Use
      </button>

      {isOpen && (
        <div className="guide-panel">
          <div className="guide-header">
            <h3>📖 How to Use Chinese Learning App</h3>
            <button 
              className="close-guide"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="guide-content">
            <div className="guide-section">
              <h4>🎯 Getting Started</h4>
              <ol>
                <li>Enter or paste Chinese text in the input field</li>
                <li>Click <strong>"Segment and Convert"</strong> to process the text</li>
                <li>Words will appear with Pinyin and English translations</li>
              </ol>
            </div>

            <div className="guide-section">
              <h4>💾 Saving Vocabulary</h4>
              <ol>
                <li><strong>Hover</strong> over any word to see detailed information</li>
                <li>A tooltip will appear with Pinyin and translation</li>
                <li>Click <strong>Level 1, 2, or 3</strong> buttons to save words</li>
                <li>Saved words will be highlighted with colored borders</li>
              </ol>
            </div>

            <div className="guide-section">
              <h4>⚙️ Practice Modes</h4>
              <ul>
                <li><strong>Normal Mode</strong>: Shows everything (characters, Pinyin, English)</li>
                <li><strong>Practice Translation</strong>: Hide English, practice translating from Pinyin</li>
                <li><strong>Characters Only</strong>: Hide Pinyin, practice reading characters</li>
                <li><strong>Full Practice</strong>: Hide everything except characters</li>
              </ul>
            </div>

            <div className="guide-section">
              <h4>🔊 Speech Features</h4>
              <ul>
                <li>Use <strong>"Speak Text"</strong> to hear the full text</li>
                <li>Use <strong>"Speak Words"</strong> to hear segmented pronunciation</li>
                <li>Adjust speech rate and select different voices in Settings</li>
                <li>Click 🔊 in tooltips to hear individual words</li>
              </ul>
            </div>

            <div className="guide-section">
              <h4>📚 Vocabulary Management</h4>
              <ul>
                <li>View all saved words in the <strong>Vocabulary Manager</strong></li>
                <li>Switch between Level 1, 2, 3 tabs</li>
                <li>Export your vocabulary as JSON file</li>
                <li>Remove words you no longer need</li>
              </ul>
            </div>

            <div className="guide-section">
              <h4>💡 Tips for Effective Learning</h4>
              <ul>
                <li>Start with <strong>Normal Mode</strong> to learn new words</li>
                <li>Use <strong>Practice Translation</strong> mode to test comprehension</li>
                <li>Try <strong>Characters Only</strong> mode for reading practice</li>
                <li>Save words by difficulty: Level 1 (easy), Level 2 (medium), Level 3 (hard)</li>
                <li>Use speech features to improve pronunciation</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageGuide;