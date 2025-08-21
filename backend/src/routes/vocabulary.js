const express = require('express');
const { body, param } = require('express-validator');
const vocabularyController = require('../controllers/vocabularyController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const addWordValidation = [
  body('word')
    .notEmpty()
    .withMessage('Word is required')
    .isLength({ max: 255 })
    .withMessage('Word must be less than 255 characters'),
  
  body('level')
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),
  
  body('pinyin')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Pinyin must be less than 255 characters'),
  
  body('translation')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Translation must be less than 500 characters')
];

const updateWordValidation = [
  param('word')
    .notEmpty()
    .withMessage('Word parameter is required'),
  
  body('level')
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3'),
  
  body('pinyin')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Pinyin must be less than 255 characters'),
  
  body('translation')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Translation must be less than 500 characters')
];

const wordParamValidation = [
  param('word')
    .notEmpty()
    .withMessage('Word parameter is required')
];

const levelParamValidation = [
  param('level')
    .isInt({ min: 1, max: 3 })
    .withMessage('Level must be 1, 2, or 3')
];

// All vocabulary routes require authentication
router.use(auth);

// Routes
router.get('/', vocabularyController.getAllVocabulary);
router.get('/stats', vocabularyController.getStats);
router.get('/level/:level', levelParamValidation, vocabularyController.getVocabularyByLevel);
router.get('/word/:word', wordParamValidation, vocabularyController.getWordLevel);

router.post('/', addWordValidation, vocabularyController.addWord);
router.put('/:word', updateWordValidation, vocabularyController.updateWord);
router.delete('/:word', wordParamValidation, vocabularyController.deleteWord);
router.delete('/', vocabularyController.clearVocabulary);

module.exports = router;