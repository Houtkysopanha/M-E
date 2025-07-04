import api from './api';

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete/deactivate user
export const deleteUser = async (userId, permanent = false) => {
  try {
    const url = `/admin/users/${userId}${permanent ? '?permanent=true' : ''}`;
    const response = await api.delete(url);
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get system statistics
export const getSystemStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get actions for a specific user (would need new backend endpoint)
export const getUserActions = async (userId, params = {}) => {
  try {
    // This would require a new backend endpoint like /admin/users/:id/actions
    // For now, we'll simulate this functionality
    const queryParams = new URLSearchParams();
    
    if (params.year) queryParams.append('year', params.year);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // This is a placeholder - you'd need to implement this endpoint in the backend
    const url = `/admin/users/${userId}/actions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Action Plan Management

// Create new action plan
export const createActionPlan = async (actionPlanData) => {
  try {
    const response = await api.post('/admin/action-plans', actionPlanData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get all action plans
export const getAllActionPlans = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `/admin/action-plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);

    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get specific action plan
export const getActionPlan = async (id) => {
  try {
    const response = await api.get(`/admin/action-plans/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update action plan
export const updateActionPlan = async (id, actionPlanData) => {
  try {
    const response = await api.put(`/admin/action-plans/${id}`, actionPlanData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete action plan
export const deleteActionPlan = async (id) => {
  try {
    const response = await api.delete(`/admin/action-plans/${id}`);
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
