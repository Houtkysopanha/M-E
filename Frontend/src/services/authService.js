import api from './api';
import { setToken, setCurrentUser, removeToken } from '../utils/auth';

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      setToken(token);
      setCurrentUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get current user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    
    if (response.data.success) {
      const user = response.data.data.user;
      setCurrentUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
  }
};

// Verify token validity
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data.success;
  } catch (error) {
    return false;
  }
};
