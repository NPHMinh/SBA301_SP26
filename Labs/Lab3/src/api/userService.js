import axios from './axios';

export const userService = {
  // GET - Lấy tất cả users
  getAllUsers: async () => {
    try {
      const response = await axios.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET - Lấy user theo ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST - Tạo user mới (FIX ID)
  createUser: async (userData) => {
    try {
      // Lấy tất cả users để tìm ID lớn nhất
      const allUsers = await axios.get('/users');
      const maxId = allUsers.data.reduce((max, user) => {
        const id = parseInt(user.id);
        return id > max ? id : max;
      }, 0);
      
      // Tạo user mới với ID tuần tự
      const newUser = {
        ...userData,
        id: String(maxId + 1)
      };
      
      const response = await axios.post('/users', newUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT - Cập nhật user
  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`/users/${id}`, {
        ...userData,
        id: id  // Đảm bảo ID không thay đổi
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH - Cập nhật một phần user
  patchUser: async (id, userData) => {
    try {
      const response = await axios.patch(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE - Xóa user
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Authenticate user
  authenticate: async (username, password) => {
    try {
      const response = await axios.get(`/users?username=${username}&password=${password}`);
      return response.data[0] || null;
    } catch (error) {
      throw error;
    }
  }
};