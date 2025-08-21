const { validationResult } = require('express-validator');
const Vocabulary = require('../models/Vocabulary');

const getAllVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByUserId(req.user.id);
    res.json({
      vocabulary: vocabulary.map(word => ({
        word: word.word,
        level: word.level,
        pinyin: word.pinyin,
        translation: word.translation,
        dateAdded: word.created_at
      }))
    });
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getVocabularyByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const levelNum = parseInt(level);
    
    if (levelNum < 1 || levelNum > 3) {
      return res.status(400).json({ error: 'Level must be 1, 2, or 3' });
    }

    const vocabulary = await Vocabulary.findByUserIdAndLevel(req.user.id, levelNum);
    res.json({
      level: levelNum,
      vocabulary: vocabulary.map(word => ({
        word: word.word,
        level: word.level,
        pinyin: word.pinyin,
        translation: word.translation,
        dateAdded: word.created_at
      }))
    });
  } catch (error) {
    console.error('Get vocabulary by level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addWord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { word, level, pinyin, translation } = req.body;
    
    const savedWord = await Vocabulary.create(
      req.user.id,
      word,
      level,
      pinyin || null,
      translation || null
    );

    res.status(201).json({
      message: 'Word saved successfully',
      word: {
        word: savedWord.word,
        level: savedWord.level,
        pinyin: savedWord.pinyin,
        translation: savedWord.translation,
        dateAdded: savedWord.created_at
      }
    });

  } catch (error) {
    console.error('Add word error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateWord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { word } = req.params;
    const { level, pinyin, translation } = req.body;

    // Check if word exists for this user
    const existingWord = await Vocabulary.findByUserIdAndWord(req.user.id, word);
    if (!existingWord) {
      return res.status(404).json({ error: 'Word not found in your vocabulary' });
    }

    const updatedWord = await Vocabulary.update(
      req.user.id,
      word,
      level,
      pinyin || null,
      translation || null
    );

    res.json({
      message: 'Word updated successfully',
      word: {
        word: updatedWord.word,
        level: updatedWord.level,
        pinyin: updatedWord.pinyin,
        translation: updatedWord.translation,
        dateAdded: updatedWord.created_at
      }
    });

  } catch (error) {
    console.error('Update word error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteWord = async (req, res) => {
  try {
    const { word } = req.params;

    const deletedWord = await Vocabulary.delete(req.user.id, word);
    if (!deletedWord) {
      return res.status(404).json({ error: 'Word not found in your vocabulary' });
    }

    res.json({ message: 'Word removed successfully' });

  } catch (error) {
    console.error('Delete word error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const clearVocabulary = async (req, res) => {
  try {
    const deletedCount = await Vocabulary.deleteAllByUserId(req.user.id);
    
    res.json({ 
      message: 'Vocabulary cleared successfully',
      deletedCount 
    });

  } catch (error) {
    console.error('Clear vocabulary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await Vocabulary.getStats(req.user.id);
    
    res.json({
      stats: {
        total: parseInt(stats.total),
        level1: parseInt(stats.level1),
        level2: parseInt(stats.level2),
        level3: parseInt(stats.level3)
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getWordLevel = async (req, res) => {
  try {
    const { word } = req.params;
    
    const wordData = await Vocabulary.findByUserIdAndWord(req.user.id, word);
    
    if (!wordData) {
      return res.json({ level: null });
    }

    res.json({ 
      level: wordData.level,
      pinyin: wordData.pinyin,
      translation: wordData.translation
    });

  } catch (error) {
    console.error('Get word level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllVocabulary,
  getVocabularyByLevel,
  addWord,
  updateWord,
  deleteWord,
  clearVocabulary,
  getStats,
  getWordLevel
};