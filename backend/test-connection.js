// Simple test to verify database connection and API endpoints
const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:5000';

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const pool = require('./src/config/database');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful');
    console.log(`   Current time: ${result.rows[0].current_time}`);
    await pool.end();
  } catch (error) {
    console.log('❌ Database connection failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
  
  return true;
}

async function testAPIEndpoints() {
  console.log('\nTesting API endpoints...');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health endpoint working');
    console.log(`   Status: ${healthResponse.data.status}`);
    
    // Test root endpoint
    const rootResponse = await axios.get(`${API_BASE}/`);
    console.log('✅ Root endpoint working');
    console.log(`   API Name: ${rootResponse.data.name}`);
    
    return true;
  } catch (error) {
    console.log('❌ API endpoints failed');
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure the backend server is running: npm run dev');
    return false;
  }
}

async function testRegistrationFlow() {
  console.log('\nTesting user registration flow...');
  
  try {
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'TestPassword123'
    };
    
    // Test registration
    const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, testUser);
    console.log('✅ User registration working');
    
    const token = registerResponse.data.token;
    const userId = registerResponse.data.user.id;
    
    // Test protected endpoint with token
    const profileResponse = await axios.get(`${API_BASE}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected endpoints working');
    console.log(`   User: ${profileResponse.data.user.username}`);
    
    // Test vocabulary endpoints
    const vocabData = {
      word: '你好',
      level: 1,
      pinyin: 'nǐ hǎo',
      translation: 'hello'
    };
    
    const addVocabResponse = await axios.post(`${API_BASE}/api/vocabulary`, vocabData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Vocabulary endpoints working');
    console.log(`   Added word: ${addVocabResponse.data.word.word}`);
    
    return true;
  } catch (error) {
    console.log('❌ Registration flow failed');
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Chinese Learning App Backend Tests\n');
  
  const dbSuccess = await testDatabaseConnection();
  if (!dbSuccess) {
    console.log('\n💡 Setup database first: npm run init-db');
    return;
  }
  
  const apiSuccess = await testAPIEndpoints();
  if (!apiSuccess) {
    return;
  }
  
  const regSuccess = await testRegistrationFlow();
  
  if (dbSuccess && apiSuccess && regSuccess) {
    console.log('\n🎉 All tests passed! Your backend is ready.');
    console.log('   Start the frontend: cd ../chinese-learning-app && npm start');
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
  }
}

runTests();