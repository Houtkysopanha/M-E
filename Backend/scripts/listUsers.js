const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function listUsers() {
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

    // Get all users
    console.log('👥 Fetching all users...');
    
    const usersResponse = await axios.get(`${API_BASE}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (usersResponse.data.success) {
      console.log('✅ Users found:');
      console.log('');
      
      const users = usersResponse.data.data.users;
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleDateString()}`);
        console.log('');
      });
      
      console.log(`📊 Total Users: ${users.length}`);
    } else {
      console.log('❌ Failed to get users:', usersResponse.data.message);
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
listUsers();
