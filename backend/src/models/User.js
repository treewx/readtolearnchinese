const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password) {
    try {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, password_hash, created_at FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, password_hash, created_at FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmailOrUsername(emailOrUsername) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, password_hash, created_at FROM users WHERE email = $1 OR username = $1',
        [emailOrUsername]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updatePassword(userId, newPassword) {
    try {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
      
      const result = await pool.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
        [passwordHash, userId]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;