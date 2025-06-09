# 🚀 User Action Tracking System - Complete Implementation

A full-stack web application with time-based CRUD restrictions, role-based access control, and modern responsive design.

## 📋 **Project Summary**

This project implements a comprehensive user action tracking system with the following key features:

- **Backend**: Node.js + Express + MongoDB with JWT authentication
- **Frontend**: React.js + Tailwind CSS with responsive design
- **Time-Based Logic**: Users can only modify data from the current year (2025)
- **Role Management**: Admin and User roles with appropriate permissions
- **User Limits**: Maximum 30 active users in the system

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │◄──────────────────►│                 │
│   React.js      │                    │   Node.js       │
│   Frontend      │                    │   Backend       │
│   (Port 5174)   │                    │   (Port 3001)   │
│                 │                    │                 │
└─────────────────┘                    └─────────────────┘
                                                │
                                                │ Mongoose ODM
                                                ▼
                                       ┌─────────────────┐
                                       │                 │
                                       │   MongoDB       │
                                       │   Database      │
                                       │   (Port 27017)  │
                                       │                 │
                                       └─────────────────┘
```

## 📁 **Project Structure**

```
Project/
├── Backend/                    # Node.js Backend
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Authentication
│   │   ├── adminController.js # Admin operations
│   │   └── userController.js  # User operations
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── models/               # MongoDB schemas
│   │   ├── User.js          # User model
│   │   └── Action.js        # Action model
│   ├── routes/              # API routes
│   │   ├── auth.js         # Auth routes
│   │   ├── admin.js        # Admin routes
│   │   └── user.js         # User routes
│   ├── utils/
│   │   └── timeValidation.js # Time-based logic
│   ├── test/               # Testing files
│   │   ├── simpleTest.js   # Automated tests
│   │   └── frontend-test.html # Manual testing
│   ├── .env               # Environment variables
│   ├── package.json       # Dependencies
│   ├── server.js          # Main server file
│   └── README.md          # Backend documentation
│
├── Frontend/                  # React.js Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── common/      # Reusable components
│   │   │   ├── auth/        # Authentication
│   │   │   ├── actions/     # Action management
│   │   │   └── admin/       # Admin components
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── UserPage.jsx
│   │   │   └── SuperAdminPage.jsx
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app
│   │   └── main.jsx         # Entry point
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── README.md           # Frontend documentation
│
├── API_documentation.md       # Complete API docs
├── USER_ROUTES_DOCUMENTATION.md # User routes details
└── PROJECT_OVERVIEW.md       # This file
```

## 🔧 **Technology Stack**

### Backend Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, CORS, rate limiting
- **Testing**: Custom test suite

### Frontend Technologies
- **Framework**: React.js 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.3.6
- **Routing**: React Router DOM 6.26.0
- **HTTP Client**: Axios 1.6.0
- **State Management**: React Hooks

## 🚀 **Quick Start Guide**

### 1. Backend Setup
```bash
cd Backend
npm install
npm start
```
- Server runs on: `http://localhost:3001`
- Default admin: `admin` / `admin123`

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
- Frontend runs on: `http://localhost:5174`
- Auto-opens in browser

### 3. Access the Application
1. Open `http://localhost:5174`
2. Login with admin credentials: `admin` / `admin123`
3. Explore all features!

## 👥 **User Roles & Permissions**

### 🌐 **Public Access**
- Login page
- API health check

### 🔒 **Authenticated Users**
- Home page (view all actions)
- User dashboard (manage personal actions)
- Profile management

### 👑 **Super Admin**
- All user features
- User management (create, edit, delete)
- System statistics
- View all user actions

## 📱 **Application Pages**

### 🔐 **Login Page** (`/login`)
- **Purpose**: Secure authentication
- **Features**: 
  - Username/password login
  - Demo credential buttons
  - Auto-redirect based on role
  - Form validation

### 🏠 **Home Page** (`/home`)
- **Purpose**: System overview
- **Features**:
  - All user actions (read-only)
  - System statistics
  - Welcome dashboard
  - Quick navigation

### 📝 **User Page** (`/user`)
- **Purpose**: Personal action management
- **Features**:
  - Create new actions
  - View personal actions
  - Edit/delete current year actions
  - Personal statistics
  - Time-based restrictions

### 👑 **Super Admin Page** (`/super-admin`)
- **Purpose**: System administration
- **Features**:
  - System overview & statistics
  - User management (max 30 users)
  - Create new users
  - View all actions (planned)

## ⏰ **Time-Based CRUD Logic**

### **Current Year (2025) Actions**
- ✅ **Create**: Always allowed
- ✅ **Read**: Always allowed  
- ✅ **Update**: Allowed
- ✅ **Delete**: Allowed

### **Previous Years (2024, 2023, etc.)**
- ✅ **Create**: Allowed (timestamp set to current)
- ✅ **Read**: Always allowed
- ❌ **Update**: Forbidden with clear error message
- ❌ **Delete**: Forbidden with clear error message

### **Implementation**
- Frontend: Visual indicators (badges, disabled buttons)
- Backend: Server-side validation
- Database: Immutable `createdAt` timestamps

## 🔌 **API Endpoints**

### **Authentication** (`/api/auth`)
- `POST /login` - User login
- `GET /profile` - Get user profile
- `POST /logout` - User logout

### **Admin** (`/api/admin`) - Admin Only
- `POST /users` - Create user
- `GET /users` - Get all users
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /stats` - System statistics

### **User Actions** (`/api/user`) - Authenticated
- `POST /actions` - Create action
- `GET /actions` - Get user actions
- `GET /actions/:id` - Get specific action
- `PUT /actions/:id` - Update action (current year only)
- `DELETE /actions/:id` - Delete action (current year only)
- `GET /actions/stats` - Action statistics

## 🛡️ **Security Features**

### **Authentication & Authorization**
- JWT-based stateless authentication
- Role-based access control
- Token expiration handling
- Secure password hashing (bcrypt)

### **API Security**
- CORS protection
- Rate limiting (100 requests/15 minutes)
- Input validation & sanitization
- Error handling without information leakage

### **Frontend Security**
- Protected routes
- Token storage in localStorage
- Automatic logout on token expiration
- XSS protection

## 📊 **Database Schema**

### **Users Collection**
```javascript
{
  username: String (unique, required),
  password: String (hashed),
  role: String (enum: ['admin', 'user']),
  isActive: Boolean (default: true),
  createdAt: Date,
  lastLogin: Date
}
```

### **Actions Collection**
```javascript
{
  userId: ObjectId (ref: User),
  data: Mixed (flexible JSON),
  createdAt: Date (immutable),
  updatedAt: Date
}
```

## 🧪 **Testing**

### **Backend Testing**
```bash
cd Backend
npm test
```
- Automated API testing
- All endpoints covered
- Authentication flow testing

### **Frontend Testing**
- Interactive test interface
- Manual testing capabilities
- Real-time API interaction

## 🚀 **Deployment**

### **Backend Deployment**
- Environment: Node.js 18+
- Database: MongoDB Atlas or local
- Environment variables configured
- PM2 for process management

### **Frontend Deployment**
- Build: `npm run build`
- Static hosting: Netlify, Vercel, AWS S3
- Environment variables for API URL

## 🎯 **Key Features Implemented**

✅ **Complete Authentication System**  
✅ **Role-Based Access Control (Admin/User)**  
✅ **Time-Based CRUD Restrictions**  
✅ **User Management (Max 30 Users)**  
✅ **Responsive Design (Mobile/Desktop)**  
✅ **Real-time Statistics Dashboard**  
✅ **Comprehensive Error Handling**  
✅ **API Documentation**  
✅ **Automated Testing**  
✅ **Security Best Practices**  

## 📞 **Support & Documentation**

- **Backend API**: See `Backend/API_documentation.md`
- **Frontend Guide**: See `Frontend/README.md`
- **User Routes**: See `USER_ROUTES_DOCUMENTATION.md`
- **Testing**: Run automated tests with `npm test`

## 🎉 **Project Status**

**✅ COMPLETE & PRODUCTION READY**

The User Action Tracking System is fully implemented with all requested features:
- Time-based CRUD restrictions working perfectly
- Role-based access control implemented
- Modern, responsive frontend
- Comprehensive backend API
- Complete documentation
- Automated testing suite

Ready for immediate deployment and use!
