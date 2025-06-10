const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

const sampleActions = [
  {
    title: "Team Meeting",
    description: "Weekly team standup meeting to discuss project progress and upcoming tasks",
    category: "work",
    priority: "high",
    tags: ["meeting", "team", "weekly"]
  },
  {
    title: "Code Review",
    description: "Review pull requests for the new user authentication feature",
    category: "development",
    priority: "medium",
    tags: ["code", "review", "authentication"]
  },
  {
    title: "Database Backup",
    description: "Perform scheduled database backup and verify data integrity",
    category: "maintenance",
    priority: "high",
    tags: ["database", "backup", "maintenance"]
  },
  {
    title: "Client Presentation",
    description: "Present project milestones and demo new features to client stakeholders",
    category: "business",
    priority: "urgent",
    tags: ["presentation", "client", "demo"]
  },
  {
    title: "Bug Fix",
    description: "Fix critical bug in payment processing module",
    category: "development",
    priority: "urgent",
    tags: ["bug", "payment", "critical"]
  },
  {
    title: "Documentation Update",
    description: "Update API documentation with new endpoints and examples",
    category: "documentation",
    priority: "low",
    tags: ["docs", "api", "update"]
  },
  {
    title: "Security Audit",
    description: "Conduct security audit of user authentication and authorization systems",
    category: "security",
    priority: "high",
    tags: ["security", "audit", "authentication"]
  },
  {
    title: "Performance Optimization",
    description: "Optimize database queries and improve application response times",
    category: "optimization",
    priority: "medium",
    tags: ["performance", "database", "optimization"]
  }
];

async function addSampleActions() {
  try {
    console.log('🔐 Logging in as admin...');

    // Login as admin to get token
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      throw new Error('User login failed');
    }

    const token = loginResponse.data.data.token;
    console.log('✅ User login successful');

    // Create sample actions
    console.log('📝 Creating sample actions...');
    
    for (let i = 0; i < sampleActions.length; i++) {
      const actionData = sampleActions[i];
      
      try {
        const createResponse = await axios.post(`${API_BASE}/user/actions`, {
          data: actionData
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (createResponse.data.success) {
          console.log(`✅ Created action: ${actionData.title}`);
        } else {
          console.log(`❌ Failed to create action: ${actionData.title}`);
        }
      } catch (error) {
        console.log(`❌ Error creating action "${actionData.title}":`, error.response?.data?.message || error.message);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('');
    console.log('🎉 Sample actions creation completed!');
    console.log('📋 You can now view them on the homepage and user dashboard.');

  } catch (error) {
    if (error.response?.data?.message) {
      console.log('❌ Error:', error.response.data.message);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

// Run the script
addSampleActions();
