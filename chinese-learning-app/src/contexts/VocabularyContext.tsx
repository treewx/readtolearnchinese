import React, { createContext, useContext, useState, useEffect } from 'react';

interface VocabularyWord {
  word: string;
  level: number;
  dateAdded: string;
}

interface VocabularyContextType {
  vocabulary: VocabularyWord[];
  saveWord: (word: string, level: number) => void;
  removeWord: (word: string) => void;
  getWordLevel: (word: string) => number | undefined;
  getWordsByLevel: (level: number) => VocabularyWord[];
  clearVocabulary: () => void;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const useVocabulary = (): VocabularyContextType => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};

interface VocabularyProviderProps {
  children: React.ReactNode;
}

export const VocabularyProvider: React.FC<VocabularyProviderProps> = ({ children }) => {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);

  // Load vocabulary from localStorage on component mount
  useEffect(() => {
    const savedVocabulary = localStorage.getItem('chineseLearningVocabulary');
    if (savedVocabulary) {
      try {
        const parsed = JSON.parse(savedVocabulary);
        setVocabulary(parsed);
      } catch (error) {
        console.error('Error loading vocabulary from localStorage:', error);
      }
    }
  }, []);

  // Save vocabulary to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chineseLearningVocabulary', JSON.stringify(vocabulary));
  }, [vocabulary]);

  const saveWord = (word: string, level: number) => {
    setVocabulary(prev => {
      const existingIndex = prev.findIndex(item => item.word === word);
      const newWord: VocabularyWord = {
        word,
        level,
        dateAdded: new Date().toISOString()
      };

      if (existingIndex !== -1) {
        // Update existing word
        const updated = [...prev];
        updated[existingIndex] = newWord;
        return updated;
      } else {
        // Add new word
        return [...prev, newWord];
      }
    });
  };

  const removeWord = (word: string) => {
    setVocabulary(prev => prev.filter(item => item.word !== word));
  };

  const getWordLevel = (word: string): number | undefined => {
    const found = vocabulary.find(item => item.word === word);
    return found?.level;
  };

  const getWordsByLevel = (level: number): VocabularyWord[] => {
    return vocabulary.filter(item => item.level === level);
  };

  const clearVocabulary = () => {
    setVocabulary([]);
  };

  const value: VocabularyContextType = {
    vocabulary,
    saveWord,
    removeWord,
    getWordLevel,
    getWordsByLevel,
    clearVocabulary
  };

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};