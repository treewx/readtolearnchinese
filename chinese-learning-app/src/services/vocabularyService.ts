import api from './api';

export interface VocabularyWord {
  word: string;
  level: number;
  dateAdded: string;
  pinyin?: string;
  translation?: string;
}

export interface VocabularyStats {
  total: number;
  level1: number;
  level2: number;
  level3: number;
}

export interface AddWordRequest {
  word: string;
  level: number;
  pinyin?: string;
  translation?: string;
}

export interface UpdateWordRequest {
  level: number;
  pinyin?: string;
  translation?: string;
}

class VocabularyService {
  async getAllVocabulary(): Promise<VocabularyWord[]> {
    try {
      const response = await api.get('/vocabulary');
      return response.data.vocabulary;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get vocabulary');
    }
  }

  async getVocabularyByLevel(level: number): Promise<VocabularyWord[]> {
    try {
      const response = await api.get(`/vocabulary/level/${level}`);
      return response.data.vocabulary;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get vocabulary by level');
    }
  }

  async addWord(wordData: AddWordRequest): Promise<VocabularyWord> {
    try {
      const response = await api.post('/vocabulary', wordData);
      return response.data.word;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add word');
    }
  }

  async updateWord(word: string, updateData: UpdateWordRequest): Promise<VocabularyWord> {
    try {
      const response = await api.put(`/vocabulary/${encodeURIComponent(word)}`, updateData);
      return response.data.word;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update word');
    }
  }

  async deleteWord(word: string): Promise<void> {
    try {
      await api.delete(`/vocabulary/${encodeURIComponent(word)}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete word');
    }
  }

  async clearVocabulary(): Promise<void> {
    try {
      await api.delete('/vocabulary');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clear vocabulary');
    }
  }

  async getStats(): Promise<VocabularyStats> {
    try {
      const response = await api.get('/vocabulary/stats');
      return response.data.stats;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get stats');
    }
  }

  async getWordLevel(word: string): Promise<{ level: number | null; pinyin?: string; translation?: string }> {
    try {
      const response = await api.get(`/vocabulary/word/${encodeURIComponent(word)}`);
      return response.data;
    } catch (error: any) {
      // If word not found, return null level
      if (error.response?.status === 404) {
        return { level: null };
      }
      throw new Error(error.response?.data?.error || 'Failed to get word level');
    }
  }
}

export default new VocabularyService();