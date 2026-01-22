import axios from './axios';

export const orchidService = {
  // GET - Lấy tất cả orchids
  getAllOrchids: async () => {
    try {
      const response = await axios.get('/orchids');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET - Lấy orchid theo ID
  getOrchidById: async (id) => {
    try {
      const response = await axios.get(`/orchids/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST - Tạo orchid mới (FIX ID)
  createOrchid: async (orchidData) => {
    try {
      // Lấy tất cả orchids để tìm ID lớn nhất
      const allOrchids = await axios.get('/orchids');
      const maxId = allOrchids.data.reduce((max, orchid) => {
        const id = parseInt(orchid.id);
        return id > max ? id : max;
      }, 0);
      
      // Tạo orchid mới với ID tuần tự
      const newOrchid = {
        ...orchidData,
        id: String(maxId + 1)
      };
      
      const response = await axios.post('/orchids', newOrchid);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT - Cập nhật orchid
  updateOrchid: async (id, orchidData) => {
    try {
      const response = await axios.put(`/orchids/${id}`, {
        ...orchidData,
        id: id  // Đảm bảo ID không thay đổi
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE - Xóa orchid
  deleteOrchid: async (id) => {
    try {
      const response = await axios.delete(`/orchids/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET - Search orchids
  searchOrchids: async (query) => {
    try {
      const response = await axios.get(`/orchids?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET - Filter by category
  filterByCategory: async (category) => {
    try {
      const response = await axios.get(`/orchids?category=${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};