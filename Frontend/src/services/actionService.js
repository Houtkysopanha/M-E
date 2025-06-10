import api from './api';

// Create new action
export const createAction = async (actionData) => {
  try {
    const response = await api.post('/user/actions', { data: actionData });
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get user's actions with optional filtering and pagination
export const getActions = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.year) queryParams.append('year', params.year);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/user/actions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get specific action by ID
export const getAction = async (actionId) => {
  try {
    const response = await api.get(`/user/actions/${actionId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update action
export const updateAction = async (actionId, actionData) => {
  try {
    const response = await api.put(`/user/actions/${actionId}`, { data: actionData });
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete action
export const deleteAction = async (actionId) => {
  try {
    const response = await api.delete(`/user/actions/${actionId}`);
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get action statistics
export const getActionStats = async () => {
  try {
    const response = await api.get('/user/actions/stats');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get all actions for home page (this would need a new backend endpoint)
export const getAllActions = async (params = {}) => {
  try {
    // For now, we'll use the user actions endpoint
    // In a real implementation, you'd create a new endpoint for all actions
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/user/actions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get user's assigned action plans
export const getUserActionPlans = async () => {
  try {
    const response = await api.get('/user/action-plans');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
