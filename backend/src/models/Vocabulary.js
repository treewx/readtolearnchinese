const pool = require('../config/database');

class Vocabulary {
  static async create(userId, word, level, pinyin = null, translation = null) {
    try {
      const result = await pool.query(
        `INSERT INTO vocabulary (user_id, word, level, pinyin, translation) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (user_id, word) 
         DO UPDATE SET 
           level = EXCLUDED.level,
           pinyin = EXCLUDED.pinyin,
           translation = EXCLUDED.translation,
           updated_at = CURRENT_TIMESTAMP
         RETURNING id, word, level, pinyin, translation, created_at, updated_at`,
        [userId, word, level, pinyin, translation]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const result = await pool.query(
        'SELECT id, word, level, pinyin, translation, created_at, updated_at FROM vocabulary WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserIdAndLevel(userId, level) {
    try {
      const result = await pool.query(
        'SELECT id, word, level, pinyin, translation, created_at, updated_at FROM vocabulary WHERE user_id = $1 AND level = $2 ORDER BY created_at DESC',
        [userId, level]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserIdAndWord(userId, word) {
    try {
      const result = await pool.query(
        'SELECT id, word, level, pinyin, translation, created_at, updated_at FROM vocabulary WHERE user_id = $1 AND word = $2',
        [userId, word]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(userId, word, level, pinyin = null, translation = null) {
    try {
      const result = await pool.query(
        'UPDATE vocabulary SET level = $3, pinyin = $4, translation = $5, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND word = $2 RETURNING id, word, level, pinyin, translation, created_at, updated_at',
        [userId, word, level, pinyin, translation]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(userId, word) {
    try {
      const result = await pool.query(
        'DELETE FROM vocabulary WHERE user_id = $1 AND word = $2 RETURNING id',
        [userId, word]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteAllByUserId(userId) {
    try {
      const result = await pool.query(
        'DELETE FROM vocabulary WHERE user_id = $1 RETURNING COUNT(*)',
        [userId]
      );
      return result.rowCount;
    } catch (error) {
      throw error;
    }
  }

  static async getStats(userId) {
    try {
      const result = await pool.query(
        `SELECT 
           COUNT(*) as total,
           COUNT(CASE WHEN level = 1 THEN 1 END) as level1,
           COUNT(CASE WHEN level = 2 THEN 1 END) as level2,
           COUNT(CASE WHEN level = 3 THEN 1 END) as level3
         FROM vocabulary 
         WHERE user_id = $1`,
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vocabulary;