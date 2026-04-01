import axios from 'axios';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const EXPLICIT_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || '';

const normalizeUrl = (value) => value.trim().replace(/\/+$/, '');

const FUNCTIONS_BASE_URL = EXPLICIT_FUNCTIONS_URL
  ? normalizeUrl(EXPLICIT_FUNCTIONS_URL)
  : SUPABASE_URL
    ? `${normalizeUrl(SUPABASE_URL)}/functions/v1`
    : 'http://localhost:54321/functions/v1';

const api = axios.create({
  baseURL: FUNCTIONS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('smartxerox_token');
  const token = adminToken || userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  // Student registration
  register: async (userData) => {
    const response = await api.post('/auth-register', userData);
    return response.data;
  },

  // Student login
  login: async (credentials) => {
    const response = await api.post('/auth-login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth-profile');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Create new order with file upload
  createOrder: async (formData) => {
    const response = await api.post('/orders-create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get orders by phone number
  getOrdersByPhone: async (phoneNumber) => {
    const response = await api.get('/orders-by-phone', {
      params: { phone: phoneNumber },
    });
    return response.data;
  },

  // Delete an order
  deleteOrder: async (orderId) => {
    const response = await api.delete('/orders-delete', {
      params: { id: orderId },
    });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Admin login
  login: async (email, password) => {
    const response = await api.post('/admin-login', { email, password });
    return response.data;
  },

  // Get all orders (admin only)
  getAllOrders: async (status = null) => {
    const response = await api.get('/admin-orders', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put('/admin-order-status', { id: orderId, status });
    return response.data;
  },

  // Get statistics (admin only)
  getStats: async () => {
    const response = await api.get('/admin-stats');
    return response.data;
  },
};

export default api;
