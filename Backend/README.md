# User Action Tracking System - Backend

A robust Node.js backend implementation for a user action tracking system with time-based CRUD restrictions, user management, and secure authentication.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based secure login system
- **Admin Management**: Create, update, and manage up to 30 users
- **Time-Based CRUD**: Users can only modify data from the current year
- **Action Tracking**: Store and manage user actions with flexible data structure
- **Role-Based Access**: Admin and regular user roles with appropriate permissions

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation and sanitization
- CORS protection
- Error handling without information leakage

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── adminController.js   # Admin user management
│   └── userController.js    # User action CRUD operations
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema and methods
│   └── Action.js            # Action schema and methods
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── admin.js             # Admin management routes
│   └── user.js              # User action routes
├── test/
│   ├── simpleTest.js        # Automated API tests
│   └── frontend-test.html   # Interactive web interface for testing
├── utils/
│   └── timeValidation.js    # Time-based validation utilities
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── server.js                # Main application entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone and navigate to the project**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env` file and update values as needed
   - Default MongoDB URI: `mongodb://localhost:27017/user-action-tracking`
   - Default port: `3001`

4. **Start MongoDB** (if using local installation)
   ```bash
   # Using MongoDB service
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 mongo
   ```

5. **Start the server**
   ```bash
   npm start
   # or
   node server.js
   ```

## 🔧 Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/user-action-tracking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# Admin Default Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login with username and password
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication)

#### POST `/api/auth/logout`
Logout current user (requires authentication)

### Admin Endpoints (Admin Only)

#### POST `/api/admin/users`
Create new user
```json
{
  "username": "newuser",
  "password": "password123",
  "role": "user"
}
```

#### GET `/api/admin/users`
Get all users

#### PUT `/api/admin/users/:id`
Update user details

#### DELETE `/api/admin/users/:id`
Delete/deactivate user

#### GET `/api/admin/stats`
Get system statistics

### User Action Endpoints

#### POST `/api/user/actions`
Create new action
```json
{
  "data": {
    "title": "Action Title",
    "description": "Action description",
    "category": "work"
  }
}
```

#### GET `/api/user/actions`
Get user's actions (supports pagination and year filtering)

#### GET `/api/user/actions/:id`
Get specific action

#### PUT `/api/user/actions/:id`
Update action (only current year)

#### DELETE `/api/user/actions/:id`
Delete action (only current year)

#### GET `/api/user/actions/stats`
Get user's action statistics

## 🧪 Testing

### Automated Tests
Run the comprehensive test suite:
```bash
npm test
```

### Interactive Testing
1. Start the server
2. Open `test/frontend-test.html` in your browser
3. Use the web interface to test all functionality

### Default Credentials
- **Admin**: username: `admin`, password: `admin123`

## 🔒 Time-Based CRUD Logic

The system implements year-based restrictions:

- **Create**: Always allowed, timestamp set to current time
- **Read**: Always allowed for all data
- **Update**: Only allowed for actions created in the current year
- **Delete**: Only allowed for actions created in the current year

Example: In 2025, users can only modify actions created in 2025. Actions from 2024 and earlier are read-only.

## 🏗️ Database Schema

### User Collection
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'user']),
  isActive: Boolean (default: true),
  createdAt: Date,
  lastLogin: Date
}
```

### Action Collection
```javascript
{
  userId: ObjectId (ref: User),
  data: Mixed (flexible JSON data),
  createdAt: Date (immutable),
  updatedAt: Date
}
```

## 🚦 Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🔧 Development

### Adding New Features
1. Create models in `models/`
2. Add business logic in `controllers/`
3. Define routes in `routes/`
4. Add middleware if needed in `middleware/`
5. Update tests

### Database Indexes
The system automatically creates indexes for:
- User username (unique)
- Action userId
- Action createdAt
- Combined userId + createdAt

## 📈 Performance Considerations

- MongoDB indexes for fast queries
- JWT stateless authentication
- Rate limiting to prevent abuse
- Async/await for non-blocking operations
- Connection pooling with Mongoose

## 🔐 Security Best Practices

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with expiration
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Error messages don't expose system details
- Environment variables for sensitive data

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure MongoDB Atlas or secure MongoDB instance
4. Set up HTTPS
5. Configure proper CORS origins
6. Set up monitoring and logging
7. Use PM2 or similar for process management

## 📞 Support

For issues or questions:
1. Check the test results with `npm test`
2. Verify MongoDB connection
3. Check environment variables
4. Review server logs

## 🎯 Next Steps

Potential enhancements:
- Email notifications
- File upload support
- Advanced search and filtering
- Data export functionality
- Audit logging
- Real-time updates with WebSockets
