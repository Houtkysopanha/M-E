const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create indexes for better performance
    await createIndexes();

  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Note: If MongoDB is not installed, you can:');
    console.log('1. Install MongoDB locally, or');
    console.log('2. Use MongoDB Atlas (cloud), or');
    console.log('3. Use Docker: docker run -d -p 27017:27017 mongo');
    console.log('Continuing without database connection for testing...');
    // Don't exit, allow server to start for API testing
  }
};

const createIndexes = async () => {
  try {
    // Import models to ensure they're registered
    require('../models/User');
    require('../models/Action');
    
    // Create indexes
    const User = mongoose.model('User');
    const Action = mongoose.model('Action');
    
    // Index on username for faster user lookups
    await User.collection.createIndex({ username: 1 }, { unique: true });
    
    // Index on userId and createdAt for faster action queries
    await Action.collection.createIndex({ userId: 1 });
    await Action.collection.createIndex({ createdAt: 1 });
    await Action.collection.createIndex({ userId: 1, createdAt: 1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.log('Index creation info:', error.message);
  }
};

module.exports = connectDB;
