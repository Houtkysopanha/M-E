# 🛣️ User Action Tracking System - Complete API Documentation

## 📋 **Route Overview**

| Route Category | Base Path | Required Role | Purpose |
|---------------|-----------|---------------|---------|
| Authentication | `/api/auth` | Public/Private | User login/logout/profile |
| Admin Management | `/api/admin` | Admin Only | User management & system stats |
| User Actions | `/api/user` | Authenticated Users | CRUD operations on actions |
| System | `/api/health`, `/` | Public | Health checks & API info |

---

## 🔐 **Authentication Routes** (`/api/auth`)

**File**: `Backend/routes/auth.js`  
**Controller**: `Backend/controllers/authController.js`

### 1. **POST** `/api/auth/login`
- **Role**: 🌐 **Public** (No authentication required)
- **Purpose**: User login with username/password
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "username": "admin",
        "role": "admin",
        "lastLogin": "2025-01-09T10:30:00.000Z"
      }
    }
  }
  ```
- **Error Response (401)**:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```
- **Used For**: Initial authentication to get access token

### 2. **GET** `/api/auth/profile`
- **Role**: 🔒 **Authenticated Users** (Any logged-in user)
- **Purpose**: Get current user's profile information
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "username": "admin",
        "role": "admin",
        "isActive": true,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "lastLogin": "2025-01-09T10:30:00.000Z"
      }
    }
  }
  ```
- **Used For**: Displaying user info, verifying token validity

### 3. **POST** `/api/auth/logout`
- **Role**: 🔒 **Authenticated Users** (Any logged-in user)
- **Purpose**: Logout current user (client-side token removal)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```
- **Used For**: Secure logout process

---

## 👑 **Admin Routes** (`/api/admin`)

**File**: `Backend/routes/admin.js`  
**Controller**: `Backend/controllers/adminController.js`  
**Middleware**: `authenticateToken` + `requireAdmin`

> ⚠️ **All admin routes require ADMIN role**

### 1. **POST** `/api/admin/users`
- **Role**: 👑 **Admin Only**
- **Purpose**: Create new user account
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "username": "newuser",
    "password": "password123",
    "role": "user"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "user": {
        "id": "507f1f77bcf86cd799439012",
        "username": "newuser",
        "role": "user",
        "isActive": true,
        "createdAt": "2025-01-09T10:30:00.000Z"
      }
    }
  }
  ```
- **Error Response (400)**:
  ```json
  {
    "success": false,
    "message": "Maximum user limit (30) reached"
  }
  ```
- **Restrictions**: 
  - Maximum 30 active users
  - Username must be unique
  - Password minimum 6 characters
- **Used For**: Adding new users to the system

### 2. **GET** `/api/admin/users`
- **Role**: 👑 **Admin Only**
- **Purpose**: Retrieve all users in the system
- **Headers**: `Authorization: Bearer <admin_token>`
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "id": "507f1f77bcf86cd799439011",
          "username": "admin",
          "role": "admin",
          "isActive": true,
          "createdAt": "2025-01-01T00:00:00.000Z",
          "lastLogin": "2025-01-09T10:30:00.000Z"
        }
      ],
      "totalUsers": 5,
      "activeUsers": 4
    }
  }
  ```
- **Used For**: User management dashboard, viewing all accounts

### 3. **PUT** `/api/admin/users/:id`
- **Role**: 👑 **Admin Only**
- **Purpose**: Update existing user details
- **Headers**: `Authorization: Bearer <admin_token>`
- **URL Parameter**: `id` - User ID to update
- **Request Body**:
  ```json
  {
    "username": "updatedname",
    "password": "newpassword",
    "role": "admin",
    "isActive": false
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "user": {
        "id": "507f1f77bcf86cd799439012",
        "username": "updatedname",
        "role": "admin",
        "isActive": false,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    }
  }
  ```
- **Restrictions**: Admin cannot deactivate their own account
- **Used For**: Modifying user accounts, changing roles, deactivating users

### 4. **DELETE** `/api/admin/users/:id`
- **Role**: 👑 **Admin Only**
- **Purpose**: Delete or deactivate user account
- **Headers**: `Authorization: Bearer <admin_token>`
- **URL Parameter**: `id` - User ID to delete
- **Query Parameter**: `permanent=true` for permanent deletion
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "User deactivated successfully"
  }
  ```
- **Options**:
  - Default: Soft delete (deactivate user)
  - `?permanent=true`: Hard delete (remove user + all actions)
- **Restrictions**: Admin cannot delete their own account
- **Used For**: Removing users from the system

### 5. **GET** `/api/admin/stats`
- **Role**: 👑 **Admin Only**
- **Purpose**: Get comprehensive system statistics
- **Headers**: `Authorization: Bearer <admin_token>`
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "users": {
        "total": 10,
        "active": 8,
        "inactive": 2,
        "admins": 2,
        "regular": 6
      },
      "actions": {
        "total": 150,
        "currentYear": 45,
        "previousYears": 105
      },
      "limits": {
        "maxUsers": 30,
        "remainingSlots": 20
      }
    }
  }
  ```
- **Used For**: Admin dashboard, monitoring system usage
