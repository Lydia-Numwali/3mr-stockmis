import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
};

// Products
export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getBestSelling: (limit = 10) => api.get('/products/best-selling', { params: { limit } }),
};

// Stock
export const stockApi = {
  addStock: (data) => api.post('/stock/add', data),
  getMovements: (params) => api.get('/stock/movements', { params }),
};

// Sales
export const salesApi = {
  create: (data) => api.post('/sales', data),
  getAll: (params) => api.get('/sales', { params }),
  getRevenue: () => api.get('/sales/revenue'),
};

// Lending
export const lendingApi = {
  create: (data) => api.post('/lending', data),
  returnItem: (id, data) => api.put(`/lending/${id}/return`, data),
  getAll: (params) => api.get('/lending', { params }),
  getOverdue: () => api.get('/lending/overdue'),
};

// Dashboard
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueTrend: () => api.get('/dashboard/revenue-trend'),
  getCategoryBreakdown: () => api.get('/dashboard/category-breakdown'),
  getLowStock: () => api.get('/dashboard/low-stock'),
};

// Reports
export const reportsApi = {
  getSales: (params) => api.get('/reports/sales', { params }),
  getStock: () => api.get('/reports/stock'),
  getLending: () => api.get('/reports/lending'),
  getIncome: () => api.get('/reports/income'),
  exportSales: (params) => api.get('/reports/export/sales', { params, responseType: 'blob' }),
  exportStock: () => api.get('/reports/export/stock', { responseType: 'blob' }),
  exportLending: () => api.get('/reports/export/lending', { responseType: 'blob' }),
};
