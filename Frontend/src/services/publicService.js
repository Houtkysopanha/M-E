import axios from 'axios';

// Create axios instance for public API calls (no authentication required)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for public API
publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle other errors
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Get public actions overview
export const getPublicActionsOverview = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/public/actions/overview${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await publicApi.get(url);
    
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get public system stats
export const getPublicStats = async () => {
  try {
    const response = await publicApi.get('/public/stats');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default publicApi;
