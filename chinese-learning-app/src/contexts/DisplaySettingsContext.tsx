import React, { createContext, useContext, useState, useEffect } from 'react';

interface DisplaySettings {
  showChinese: boolean;
  showPinyin: boolean;
  showTranslation: boolean;
  practiceMode: 'normal' | 'chinese-only' | 'no-translation' | 'characters-only';
  tilePinyinSize: 'small' | 'medium' | 'large';
  tileEnglishSize: 'small' | 'medium' | 'large';
}

interface DisplaySettingsContextType {
  settings: DisplaySettings;
  updateSettings: (newSettings: Partial<DisplaySettings>) => void;
  setPracticeMode: (mode: DisplaySettings['practiceMode']) => void;
  resetSettings: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const defaultSettings: DisplaySettings = {
  showChinese: true,
  showPinyin: true,
  showTranslation: true,
  practiceMode: 'normal',
  tilePinyinSize: 'medium',
  tileEnglishSize: 'medium'
};

const DisplaySettingsContext = createContext<DisplaySettingsContextType | undefined>(undefined);

export const useDisplaySettings = (): DisplaySettingsContextType => {
  const context = useContext(DisplaySettingsContext);
  if (!context) {
    throw new Error('useDisplaySettings must be used within a DisplaySettingsProvider');
  }
  return context;
};

interface DisplaySettingsProviderProps {
  children: React.ReactNode;
}

export const DisplaySettingsProvider: React.FC<DisplaySettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<DisplaySettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chineseLearningDisplaySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading display settings from localStorage:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chineseLearningDisplaySettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<DisplaySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setPracticeMode = (mode: DisplaySettings['practiceMode']) => {
    let newSettings: Partial<DisplaySettings>;
    
    switch (mode) {
      case 'chinese-only':
        newSettings = {
          practiceMode: mode,
          showChinese: true,
          showPinyin: false,
          showTranslation: false
        };
        break;
      case 'no-translation':
        newSettings = {
          practiceMode: mode,
          showChinese: true,
          showPinyin: true,
          showTranslation: false
        };
        break;
      case 'characters-only':
        newSettings = {
          practiceMode: mode,
          showChinese: true,
          showPinyin: false,
          showTranslation: false
        };
        break;
      default: // normal
        newSettings = {
          practiceMode: mode,
          showChinese: true,
          showPinyin: true,
          showTranslation: true
        };
    }
    
    updateSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value: DisplaySettingsContextType = {
    settings,
    updateSettings,
    setPracticeMode,
    resetSettings,
    showSettings,
    setShowSettings
  };

  return (
    <DisplaySettingsContext.Provider value={value}>
      {children}
    </DisplaySettingsContext.Provider>
  );
};