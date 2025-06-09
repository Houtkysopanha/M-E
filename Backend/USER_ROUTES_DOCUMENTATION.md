# 📝 **User Action Routes** (`/api/user`)

**File**: `Backend/routes/user.js`  
**Controller**: `Backend/controllers/userController.js`  
**Middleware**: `authenticateToken`

> 🔒 **All user routes require authentication (any role)**

## Routes Overview

| Method | Endpoint | Purpose | Time Restriction |
|--------|----------|---------|------------------|
| POST | `/api/user/actions` | Create new action | ✅ Always allowed |
| GET | `/api/user/actions` | Get user's actions | ✅ Always allowed |
| GET | `/api/user/actions/stats` | Get action statistics | ✅ Always allowed |
| GET | `/api/user/actions/:id` | Get specific action | ✅ Always allowed |
| PUT | `/api/user/actions/:id` | Update action | ⏰ Current year only |
| DELETE | `/api/user/actions/:id` | Delete action | ⏰ Current year only |

---

## 1. **POST** `/api/user/actions`
- **Role**: 🔒 **Authenticated Users** (Admin or User)
- **Purpose**: Create new action entry
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "data": {
      "title": "Meeting Notes",
      "description": "Weekly team meeting",
      "category": "work",
      "customField": "any data structure"
    }
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "success": true,
    "message": "Action created successfully",
    "data": {
      "action": {
        "id": "507f1f77bcf86cd799439013",
        "data": {
          "title": "Meeting Notes",
          "description": "Weekly team meeting",
          "category": "work"
        },
        "createdAt": "2025-01-09T10:30:00.000Z",
        "updatedAt": "2025-01-09T10:30:00.000Z",
        "creationYear": 2025,
        "canModify": true
      }
    }
  }
  ```
- **Features**: 
  - Flexible data structure (accepts any JSON)
  - Automatic timestamp assignment
  - User association
- **Used For**: Recording user activities/actions

---

## 2. **GET** `/api/user/actions`
- **Role**: 🔒 **Authenticated Users** (Admin or User)
- **Purpose**: Retrieve user's actions with filtering and pagination
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `year=2025` - Filter by specific year
  - `page=1` - Page number for pagination
  - `limit=10` - Items per page (max 100)
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "actions": [
        {
          "id": "507f1f77bcf86cd799439013",
          "data": {
            "title": "Meeting Notes",
            "description": "Weekly team meeting"
          },
          "createdAt": "2025-01-09T10:30:00.000Z",
          "updatedAt": "2025-01-09T10:30:00.000Z",
          "creationYear": 2025,
          "canModify": true
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 3,
        "totalActions": 25,
        "hasNextPage": true,
        "hasPrevPage": false
      },
      "filter": {
        "year": 2025,
        "currentYear": 2025
      }
    }
  }
  ```
- **Features**:
  - Only returns current user's actions
  - Pagination support
  - Year-based filtering
- **Used For**: Displaying user's action history

---

## 3. **GET** `/api/user/actions/stats`
- **Role**: 🔒 **Authenticated Users** (Admin or User)
- **Purpose**: Get user's action statistics
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "total": 25,
      "currentYear": 15,
      "previousYears": 10,
      "byYear": [
        {
          "year": 2025,
          "count": 15,
          "canModify": true
        },
        {
          "year": 2024,
          "count": 10,
          "canModify": false
        }
      ],
      "currentYearInfo": {
        "year": 2025,
        "canCreate": true,
        "canModify": true
      }
    }
  }
  ```
- **Used For**: User dashboard, analytics

---

## 4. **GET** `/api/user/actions/:id`
- **Role**: 🔒 **Authenticated Users** (Admin or User)
- **Purpose**: Retrieve specific action by ID
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - Action ID
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "action": {
        "id": "507f1f77bcf86cd799439013",
        "data": {
          "title": "Meeting Notes",
          "description": "Weekly team meeting"
        },
        "createdAt": "2025-01-09T10:30:00.000Z",
        "updatedAt": "2025-01-09T10:30:00.000Z",
        "creationYear": 2025,
        "canModify": true
      }
    }
  }
  ```
- **Security**: Only returns action if it belongs to current user
- **Used For**: Viewing detailed action information

---

## 5. **PUT** `/api/user/actions/:id`
- **Role**: 🔒 **Authenticated Users** (Admin or User)
- **Purpose**: Update existing action
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - Action ID to update
- **Request Body**:
  ```json
  {
    "data": {
      "title": "Updated Meeting Notes",
      "description": "Updated description",
      "category": "work-updated"
    }
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Action updated successfully",
    "data": {
      "action": {
        "id": "507f1f77bcf86cd799439013",
        "data": {
          "title": "Updated Meeting Notes",
          "description": "Updated description",
          "category": "work-updated"
        },
        "createdAt": "2025-01-09T10:30:00.000Z",
        "updatedAt": "2025-01-09T11:00:00.000Z",
        "creationYear": 2025,
        "canModify": true
      }
    }
  }
  ```
- **Error Response (403)**:
  ```json
  {
    "success": false,
    "message": "Cannot update data from 2024. Only current year (2025) data can be modified."
  }
  ```
- **⏰ Time Restriction**: Only actions created in current year (2025) can be updated
- **Security**: Only owner can update their actions
- **Used For**: Modifying recent action entries

---

## 6. **DELETE** `/api/user/actions/:id`
- **Role**: 🔒 **Authenticated Users** (Admin or User)
- **Purpose**: Delete action entry
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` - Action ID to delete
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Action deleted successfully"
  }
  ```
- **Error Response (403)**:
  ```json
  {
    "success": false,
    "message": "Cannot delete data from 2024. Only current year (2025) data can be modified."
  }
  ```
- **⏰ Time Restriction**: Only actions created in current year (2025) can be deleted
- **Security**: Only owner can delete their actions
- **Used For**: Removing unwanted action entries

---

## ⏰ **Time-Based Restrictions**

### **Current Year (2025)**:
- ✅ **Create**: Always allowed
- ✅ **Read**: Always allowed
- ✅ **Update**: Allowed
- ✅ **Delete**: Allowed

### **Previous Years (2024, 2023, etc.)**:
- ✅ **Create**: Allowed (but timestamp set to current year)
- ✅ **Read**: Always allowed
- ❌ **Update**: Forbidden (403 error)
- ❌ **Delete**: Forbidden (403 error)

### **Implementation**:
The system automatically checks the `createdAt` year against the current year before allowing update/delete operations.
