# Chinese Learning App Backend

Backend API for the Chinese Learning App with PostgreSQL database integration.

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v12 or later)
- npm

## Setup Instructions

### 1. Database Setup

First, make sure PostgreSQL is installed and running. Create a database:

```sql
CREATE DATABASE chinese_learning_app;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE chinese_learning_app TO your_username;
```

### 2. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your database credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chinese_learning_app
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database

Run the database initialization script to create tables:

```bash
npm run init-db
```

This will create:
- `users` table (id, username, email, password_hash, created_at, updated_at)
- `vocabulary` table (id, user_id, word, level, pinyin, translation, created_at, updated_at)

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `GET /api/auth/verify` - Verify JWT token (requires auth)

### Vocabulary
- `GET /api/vocabulary` - Get all user's vocabulary (requires auth)
- `GET /api/vocabulary/stats` - Get vocabulary statistics (requires auth)
- `GET /api/vocabulary/level/:level` - Get vocabulary by level (requires auth)
- `GET /api/vocabulary/word/:word` - Get specific word data (requires auth)
- `POST /api/vocabulary` - Add new word (requires auth)
- `PUT /api/vocabulary/:word` - Update existing word (requires auth)
- `DELETE /api/vocabulary/:word` - Delete specific word (requires auth)
- `DELETE /api/vocabulary` - Clear all vocabulary (requires auth)

### Health Check
- `GET /health` - Server health status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vocabulary Table
```sql
CREATE TABLE vocabulary (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 3),
  pinyin VARCHAR(255),
  translation VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, word)
);
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- SQL injection protection with parameterized queries
- Helmet.js security headers

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run init-db` - Initialize database tables
- `npm run migrate` - Run database migrations (future use)

### Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": ["Validation error details"] // Only for validation errors
}
```

### Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer your-jwt-token
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure SSL/TLS for database connections
4. Set up proper logging
5. Configure reverse proxy (nginx)
6. Set up monitoring and health checks