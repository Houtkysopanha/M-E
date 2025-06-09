const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function createTestUser() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login as admin to get token
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Admin login failed');
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Admin login successful');

    // Create test user
    console.log('👤 Creating test user...');
    
    const createUserResponse = await axios.post(`${API_BASE}/admin/users`, {
      username: 'testuser1',
      password: 'password123',
      role: 'user'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (createUserResponse.data.success) {
      console.log('✅ Test user created successfully!');
      console.log('📋 User Details:');
      console.log('   Username: testuser1');
      console.log('   Password: password123');
      console.log('   Role: user');
      console.log('');
      console.log('🎉 You can now login with these credentials!');
    } else {
      console.log('❌ Failed to create user:', createUserResponse.data.message);
    }

  } catch (error) {
    if (error.response?.data?.message) {
      console.log('❌ Error:', error.response.data.message);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

// Run the script
createTestUser();
