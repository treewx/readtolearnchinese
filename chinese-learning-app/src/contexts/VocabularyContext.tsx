import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import vocabularyService, { VocabularyWord } from '../services/vocabularyService';

interface VocabularyContextType {
  vocabulary: VocabularyWord[];
  saveWord: (word: string, level: number, pinyin?: string, translation?: string) => Promise<void>;
  removeWord: (word: string) => Promise<void>;
  getWordLevel: (word: string) => number | undefined;
  getWordsByLevel: (level: number) => VocabularyWord[];
  clearVocabulary: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Load vocabulary when user changes
  useEffect(() => {
    const loadVocabulary = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        setError(null);
        try {
          const words = await vocabularyService.getAllVocabulary();
          setVocabulary(words);
        } catch (error: any) {
          console.error('Error loading vocabulary:', error);
          setError(error.message);
          setVocabulary([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear vocabulary when not authenticated
        setVocabulary([]);
      }
    };

    loadVocabulary();
  }, [user, isAuthenticated]);

  const saveWord = async (word: string, level: number, pinyin?: string, translation?: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Must be logged in to save words');
    }

    try {
      setError(null);
      
      // Check if word already exists
      const existingWordIndex = vocabulary.findIndex(item => item.word === word);
      
      if (existingWordIndex !== -1) {
        // Update existing word
        const updatedWord = await vocabularyService.updateWord(word, { level, pinyin, translation });
        setVocabulary(prev => {
          const updated = [...prev];
          updated[existingWordIndex] = updatedWord;
          return updated;
        });
      } else {
        // Add new word
        const newWord = await vocabularyService.addWord({ word, level, pinyin, translation });
        setVocabulary(prev => [newWord, ...prev]);
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const removeWord = async (word: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Must be logged in to remove words');
    }

    try {
      setError(null);
      await vocabularyService.deleteWord(word);
      setVocabulary(prev => prev.filter(item => item.word !== word));
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const getWordLevel = (word: string): number | undefined => {
    const found = vocabulary.find(item => item.word === word);
    return found?.level;
  };

  const getWordsByLevel = (level: number): VocabularyWord[] => {
    return vocabulary.filter(item => item.level === level);
  };

  const clearVocabulary = async (): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Must be logged in to clear vocabulary');
    }

    try {
      setError(null);
      await vocabularyService.clearVocabulary();
      setVocabulary([]);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const value: VocabularyContextType = {
    vocabulary,
    saveWord,
    removeWord,
    getWordLevel,
    getWordsByLevel,
    clearVocabulary,
    isLoading,
    error
  };

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};