/**
 * Simple test file to verify the backend implementation
 * This is a basic test that doesn't require additional testing frameworks
 */

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3001';
let authToken = '';
let testUserId = '';
let testActionId = '';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await makeRequest('GET', '/api/health');
    if (response.status === 200 && response.data.success) {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testAdminLogin() {
  console.log('\n🔍 Testing Admin Login...');
  try {
    const response = await makeRequest('POST', '/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    if (response.status === 200 && response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Admin login successful');
      console.log('   Token received:', authToken.substring(0, 20) + '...');
      return true;
    } else {
      console.log('❌ Admin login failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
    return false;
  }
}

async function testCreateUser() {
  console.log('\n🔍 Testing Create User...');
  try {
    const response = await makeRequest('POST', '/api/admin/users', {
      username: 'testuser1',
      password: 'password123',
      role: 'user'
    }, {
      'Authorization': `Bearer ${authToken}`
    });

    if (response.status === 201 && response.data.success) {
      testUserId = response.data.data.user.id;
      console.log('✅ User created successfully');
      console.log('   User ID:', testUserId);
      return true;
    } else {
      console.log('❌ Create user failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ Create user error:', error.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n🔍 Testing User Login...');
  try {
    const response = await makeRequest('POST', '/api/auth/login', {
      username: 'testuser1',
      password: 'password123'
    });

    if (response.status === 200 && response.data.success) {
      authToken = response.data.data.token; // Switch to user token
      console.log('✅ User login successful');
      return true;
    } else {
      console.log('❌ User login failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ User login error:', error.message);
    return false;
  }
}

async function testCreateAction() {
  console.log('\n🔍 Testing Create Action...');
  try {
    const response = await makeRequest('POST', '/api/user/actions', {
      data: {
        title: 'Test Action',
        description: 'This is a test action',
        category: 'testing',
        timestamp: new Date().toISOString()
      }
    }, {
      'Authorization': `Bearer ${authToken}`
    });

    if (response.status === 201 && response.data.success) {
      testActionId = response.data.data.action.id;
      console.log('✅ Action created successfully');
      console.log('   Action ID:', testActionId);
      console.log('   Can modify:', response.data.data.action.canModify);
      return true;
    } else {
      console.log('❌ Create action failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ Create action error:', error.message);
    return false;
  }
}

async function testGetActions() {
  console.log('\n🔍 Testing Get Actions...');
  try {
    const response = await makeRequest('GET', '/api/user/actions', null, {
      'Authorization': `Bearer ${authToken}`
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Get actions successful');
      console.log('   Total actions:', response.data.data.actions.length);
      console.log('   Current year:', response.data.data.filter.currentYear);
      return true;
    } else {
      console.log('❌ Get actions failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ Get actions error:', error.message);
    return false;
  }
}

async function testUpdateAction() {
  console.log('\n🔍 Testing Update Action...');
  try {
    const response = await makeRequest('PUT', `/api/user/actions/${testActionId}`, {
      data: {
        title: 'Updated Test Action',
        description: 'This action has been updated',
        category: 'testing-updated',
        timestamp: new Date().toISOString()
      }
    }, {
      'Authorization': `Bearer ${authToken}`
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Action updated successfully');
      return true;
    } else {
      console.log('❌ Update action failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ Update action error:', error.message);
    return false;
  }
}

async function testActionStats() {
  console.log('\n🔍 Testing Action Statistics...');
  try {
    const response = await makeRequest('GET', '/api/user/actions/stats', null, {
      'Authorization': `Bearer ${authToken}`
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Action stats retrieved successfully');
      console.log('   Total actions:', response.data.data.total);
      console.log('   Current year actions:', response.data.data.currentYear);
      return true;
    } else {
      console.log('❌ Get action stats failed:', response);
      return false;
    }
  } catch (error) {
    console.log('❌ Get action stats error:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Backend API Tests...');
  console.log('=====================================');

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Admin Login', fn: testAdminLogin },
    { name: 'Create User', fn: testCreateUser },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Create Action', fn: testCreateAction },
    { name: 'Get Actions', fn: testGetActions },
    { name: 'Update Action', fn: testUpdateAction },
    { name: 'Action Statistics', fn: testActionStats }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n=====================================');
  console.log('🏁 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server and try again.');
  }
}

// Check if server is running before starting tests
async function checkServer() {
  try {
    await makeRequest('GET', '/api/health');
    return true;
  } catch (error) {
    return false;
  }
}

// Start tests
(async () => {
  console.log('Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm start');
    console.log('   or');
    console.log('   node server.js');
    process.exit(1);
  }

  await runTests();
})();
