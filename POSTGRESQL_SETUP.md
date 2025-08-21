# PostgreSQL Setup Guide for Chinese Learning App

Complete guide to set up the Chinese Learning App with PostgreSQL database for persistent user data.

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v12 or later)
- npm or yarn

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the 'postgres' user
4. Default port is 5432

### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create Database and User

1. Open PostgreSQL command line (psql):
```bash
# Windows (from Start menu)
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

2. Create database and user:
```sql
-- Create database
CREATE DATABASE chinese_learning_app;

-- Create user (replace with your preferred username/password)
CREATE USER chinese_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE chinese_learning_app TO chinese_user;

-- Exit psql
\q
```

## Step 3: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your database credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chinese_learning_app
DB_USER=chinese_user
DB_PASSWORD=your_secure_password

# JWT Configuration (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

5. Initialize database tables:
```bash
npm run init-db
```

You should see output like:
```
Connected to PostgreSQL database
Creating database tables...
Database tables created successfully!
Tables created:
- users (id, username, email, password_hash, created_at, updated_at)
- vocabulary (id, user_id, word, level, pinyin, translation, created_at, updated_at)
```

## Step 4: Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../chinese-learning-app
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env` file to include API URL:
```env
# Add this line to your .env file
REACT_APP_API_URL=http://localhost:5000/api

# Keep your existing OpenAI configuration
REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
```

## Step 5: Start the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

The backend will start on http://localhost:5000

2. In a new terminal, start the frontend:
```bash
cd chinese-learning-app
npm start
```

The frontend will start on http://localhost:3000

## Step 6: Test the Setup

1. Open http://localhost:3000 in your browser
2. Click "Login / Register"
3. Create a new account with:
   - Username (at least 3 characters)
   - Email address
   - Password (at least 6 characters with uppercase, lowercase, and number)
4. After registration, you should be automatically logged in
5. Test adding vocabulary words to verify database persistence

## Verification

### Backend Health Check
Visit http://localhost:5000/health - should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Database Verification
Connect to your database and check the tables:
```bash
psql -U chinese_user -d chinese_learning_app
```

```sql
-- List tables
\dt

-- Check users table
SELECT * FROM users;

-- Check vocabulary table  
SELECT * FROM vocabulary;

-- Exit
\q
```

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or check Services (Windows)
- Verify database credentials in `.env` file
- Check that database and user exist in PostgreSQL

### Permission Issues
- Make sure the user has proper privileges on the database
- Re-run the GRANT command if needed

### Port Issues
- Default PostgreSQL port is 5432
- Default backend port is 5000
- Default frontend port is 3000
- Ensure these ports are not in use by other applications

### JWT Token Issues
- Make sure `JWT_SECRET` is at least 32 characters long
- Use a cryptographically secure random string

## Production Considerations

For production deployment:

1. **Security**:
   - Use strong passwords
   - Set `NODE_ENV=production`
   - Use SSL/TLS for database connections
   - Set up proper firewall rules

2. **Database**:
   - Use connection pooling
   - Set up backups
   - Monitor performance

3. **Backend**:
   - Use PM2 or similar process manager
   - Set up logging
   - Configure reverse proxy (nginx)

4. **Environment Variables**:
   - Store sensitive data in secure vaults
   - Never commit `.env` files to version control

## Features

With PostgreSQL setup, your app now has:

- ✅ **Persistent User Accounts** - Data survives browser restarts
- ✅ **Secure Authentication** - JWT tokens with bcrypt password hashing
- ✅ **User-Specific Vocabulary** - Each user has their own word lists
- ✅ **Data Integrity** - ACID compliance and referential integrity
- ✅ **Scalability** - Can handle multiple concurrent users
- ✅ **Professional Architecture** - Separation of frontend/backend concerns

Your Chinese Learning App is now ready for multiple users with persistent data storage!