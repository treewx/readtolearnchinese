// Railway deployment initialization script
const pool = require('../config/database');

const initializeForRailway = async () => {
  try {
    console.log('🚂 Initializing database for Railway deployment...');

    // Check if we're in production and tables exist
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'vocabulary')
    `);

    if (tableCheck.rows.length === 0) {
      console.log('📊 Creating database tables...');
      
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

      // Create indexes
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON vocabulary(level)`);

      // Create update triggers
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

      console.log('✅ Database tables created successfully!');
    } else {
      console.log('✅ Database tables already exist');
    }

    // Test connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log(`✅ Database connection verified at ${result.rows[0].current_time}`);

  } catch (error) {
    console.error('❌ Railway database initialization failed:', error);
    throw error;
  }
};

// Only run if called directly (not imported)
if (require.main === module) {
  initializeForRailway()
    .then(() => {
      console.log('🎉 Railway initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Railway initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initializeForRailway;