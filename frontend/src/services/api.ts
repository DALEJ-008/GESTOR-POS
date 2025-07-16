import axios from 'axios';

// API Base URL - change this based on your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect to login if needed
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API endpoints
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login/', { username, password }),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
  }) => api.post('/auth/register/', userData),
  
  refreshToken: (refresh: string) =>
    api.post('/auth/token/refresh/', { refresh }),
  
  logout: () => api.post('/auth/logout/'),
  
  getProfile: () => api.get('/auth/profile/'),
  
  updateProfile: (data: any) => api.patch('/auth/profile/', data),
  
  changePassword: (data: {
    old_password: string;
    new_password: string;
  }) => api.post('/auth/change-password/', data),
};

// Tenants API endpoints
export const tenantsAPI = {
  list: () => api.get('/tenants/'),
  create: (data: {
    name: string;
    subdomain: string;
    description?: string;
  }) => api.post('/tenants/', data),
  get: (id: number) => api.get(`/tenants/${id}/`),
  update: (id: number, data: any) => api.patch(`/tenants/${id}/`, data),
  delete: (id: number) => api.delete(`/tenants/${id}/`),
};

// Products API endpoints (will be expanded later)
export const productsAPI = {
  list: (params?: any) => api.get('/products/', { params }),
  create: (data: any) => api.post('/products/', data),
  get: (id: number) => api.get(`/products/${id}/`),
  update: (id: number, data: any) => api.patch(`/products/${id}/`, data),
  delete: (id: number) => api.delete(`/products/${id}/`),
};

// Sales API endpoints (will be expanded later)
export const salesAPI = {
  list: (params?: any) => api.get('/sales/', { params }),
  create: (data: any) => api.post('/sales/', data),
  get: (id: number) => api.get(`/sales/${id}/`),
  update: (id: number, data: any) => api.patch(`/sales/${id}/`, data),
  delete: (id: number) => api.delete(`/sales/${id}/`),
};

// Customers API endpoints (will be expanded later)
export const customersAPI = {
  list: (params?: any) => api.get('/customers/', { params }),
  create: (data: any) => api.post('/customers/', data),
  get: (id: number) => api.get(`/customers/${id}/`),
  update: (id: number, data: any) => api.patch(`/customers/${id}/`, data),
  delete: (id: number) => api.delete(`/customers/${id}/`),
};

// Inventory API endpoints (will be expanded later)
export const inventoryAPI = {
  list: (params?: any) => api.get('/inventory/', { params }),
  create: (data: any) => api.post('/inventory/', data),
  get: (id: number) => api.get(`/inventory/${id}/`),
  update: (id: number, data: any) => api.patch(`/inventory/${id}/`, data),
  delete: (id: number) => api.delete(`/inventory/${id}/`),
};

// Reports API endpoints (will be expanded later)
export const reportsAPI = {
  sales: (params?: any) => api.get('/reports/sales/', { params }),
  inventory: (params?: any) => api.get('/reports/inventory/', { params }),
  customers: (params?: any) => api.get('/reports/customers/', { params }),
  financial: (params?: any) => api.get('/reports/financial/', { params }),
};
