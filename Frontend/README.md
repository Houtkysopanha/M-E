# User Action Tracking System - Frontend

A modern React.js frontend application for the User Action Tracking System with time-based CRUD restrictions, role-based access control, and responsive design.

## 🚀 Features

### Core Functionality
- **🔐 Secure Authentication**: JWT-based login with role detection
- **🏠 Home Page**: Overview of all user actions (read-only)
- **📝 User Dashboard**: Personal action management with time-based CRUD
- **👑 Super Admin Panel**: Complete user and system management
- **⏰ Time-Based Restrictions**: Edit/delete only current year data
- **📱 Responsive Design**: Works on desktop, tablet, and mobile

### User Interface
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Intuitive Navigation**: Tab-based navigation with clear visual cues
- **Real-time Feedback**: Loading states, success/error messages
- **Accessibility**: ARIA labels, keyboard navigation support
- **Dark/Light Theme**: Consistent color scheme

## 🛠️ Technology Stack

- **Framework**: React.js 19.1.0 with Vite
- **Styling**: Tailwind CSS 3.3.6
- **Routing**: React Router DOM 6.26.0
- **HTTP Client**: Axios 1.6.0
- **Authentication**: JWT Decode 4.0.0
- **Build Tool**: Vite 6.3.5

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   ├── auth/             # Authentication components
│   │   ├── actions/          # Action management components
│   │   └── admin/            # Admin components
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
└── vite.config.js            # Vite configuration
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 3001

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Frontend: `http://localhost:5174`
   - Login with demo credentials

## 🔑 Default Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Super Admin Panel + All Features

### User Access
- **Username**: `testuser1` (if created)
- **Password**: `password123`
- **Access**: Home + User Dashboard

## 📱 Pages & Features

### 🔐 Login Page (`/login`)
- Secure user authentication
- Demo credential buttons
- Auto-redirect based on role

### 🏠 Home Page (`/home`)
- Overview of all user actions
- System statistics dashboard
- Recent actions (read-only)

### 📝 User Page (`/user`)
- Personal action management
- Time-based CRUD restrictions
- Action statistics

### 👑 Super Admin Page (`/super-admin`)
- Complete system administration
- User management (max 30 users)
- System statistics

## ⏰ Time-Based CRUD Logic

### Current Year (2025) Actions
- ✅ Create, Read, Update, Delete

### Previous Years (2024, 2023, etc.)
- ✅ Create, Read
- ❌ Update, Delete (with clear error messages)

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly messages

## 🔌 API Integration

- JWT-based authentication
- Automatic token management
- Error handling and retry logic
- Real-time validation

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🚀 Production Build

```bash
npm run build
```

Generated files in `dist/` folder ready for deployment.

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=User Action Tracking System
VITE_APP_VERSION=1.0.0
```

## 🐛 Troubleshooting

1. **Backend Connection**: Ensure backend runs on port 3001
2. **Authentication**: Clear localStorage if issues persist
3. **Build Errors**: Clear node_modules and reinstall

## 🎯 Features Implemented

✅ **Complete Authentication System**
✅ **Role-Based Access Control**
✅ **Time-Based CRUD Restrictions**
✅ **Responsive Design**
✅ **Admin User Management**
✅ **Action Management with Pagination**
✅ **Real-time Statistics**
✅ **Error Handling & Loading States**
✅ **Accessibility Features**

The frontend is fully implemented and ready for production use!
