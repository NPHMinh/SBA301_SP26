import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============== CATEGORY APIs ==============

export const categoryAPI = {
  // Lấy tất cả categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Lấy category theo ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Tạo mới category
  create: async (category) => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  // Cập nhật category
  update: async (id, category) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  // Xóa category
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// ============== ORCHID APIs ==============

export const orchidAPI = {
  // Lấy tất cả orchids
  getAll: async () => {
    const response = await api.get('/orchids');
    return response.data;
  },

  // Lấy orchid theo ID
  getById: async (id) => {
    const response = await api.get(`/orchids/${id}`);
    return response.data;
  },

  // Lấy orchids theo category
  getByCategory: async (categoryId) => {
    const response = await api.get(`/orchids/category/${categoryId}`);
    return response.data;
  },

  // Tìm kiếm orchids
  search: async (name) => {
    const response = await api.get(`/orchids/search?name=${name}`);
    return response.data;
  },

  // Tạo mới orchid
  create: async (orchid) => {
    const response = await api.post('/orchids', orchid);
    return response.data;
  },

  // Cập nhật orchid
  update: async (id, orchid) => {
    const response = await api.put(`/orchids/${id}`, orchid);
    return response.data;
  },

  // Xóa orchid
  delete: async (id) => {
    const response = await api.delete(`/orchids/${id}`);
    return response.data;
  },
};

export default api;