const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    const errorMessage = error.error || 
      (Array.isArray(error.details) ? error.details.join(', ') : error.details) || 
      'Request failed';
    throw new Error(errorMessage);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  signup: async (userData) => {
    return authFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Protected API
export const protectedAPI = {
  getProfile: async () => {
    return authFetch('/protected/profile');
  },

  getAdminData: async () => {
    return authFetch('/protected/admin');
  },

  getDashboard: async () => {
    return authFetch('/protected/dashboard');
  },
};

