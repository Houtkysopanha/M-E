import { jwtDecode } from 'jwt-decode';

// Token storage keys
const TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Set current user in localStorage
export const setCurrentUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Get user ID from token
export const getUserId = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

// Check if user is regular user
export const isUser = () => {
  return getUserRole() === 'user';
};

// Get authorization header for API requests
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Clear all authentication data
export const logout = () => {
  removeToken();
  // You might want to redirect to login page here
  window.location.href = '/login';
};

// Check token expiration and auto-logout if expired
export const checkTokenExpiration = () => {
  if (!isAuthenticated()) {
    logout();
    return false;
  }
  return true;
};
