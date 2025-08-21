const pool = require('../config/database');

const createTables = async () => {
  try {
    console.log('Creating database tables...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create vocabulary table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        word VARCHAR(255) NOT NULL,
        level INTEGER NOT NULL CHECK (level >= 1 AND level <= 3),
        pinyin VARCHAR(255),
        translation VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, word)
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON vocabulary(level);
    `);

    // Create trigger for updating updated_at timestamp
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_vocabulary_updated_at ON vocabulary;
      CREATE TRIGGER update_vocabulary_updated_at 
        BEFORE UPDATE ON vocabulary 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('Database tables created successfully!');
    console.log('Tables created:');
    console.log('- users (id, username, email, password_hash, created_at, updated_at)');
    console.log('- vocabulary (id, user_id, word, level, pinyin, translation, created_at, updated_at)');
    
  } catch (error) {
    console.error('Error creating database tables:', error);
  } finally {
    await pool.end();
  }
};

createTables();