import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../api/userService';

// 1. Tạo Context để chia sẻ dữ liệu User dùng chung cho toàn ứng dụng
const UserContext = createContext(null);

export function UserProvider({ children }) {
  // --- Khởi tạo các State quản lý dữ liệu ---
  const [users, setUsers] = useState([]);   // Danh sách người dùng
  const [loading, setLoading] = useState(false); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState(null);   // Lưu thông báo lỗi nếu có

  // 2. Tự động lấy danh sách User ngay khi ứng dụng vừa chạy
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Các hàm xử lý Logic (CRUD) ---

  // Lấy toàn bộ danh sách User từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data); // Cập nhật danh sách vào State
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false); // Hoàn tất quá trình tải (dù thành công hay thất bại)
    }
  };

  // Tìm một User theo ID
  const getUserById = async (id) => {
    try {
      return await userService.getUserById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Thêm User mới
  const addUser = async (userData) => {
    try {
      setLoading(true);
      // Tạo avatar tự động dựa trên tên người dùng
      const newUser = await userService.createUser({
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random&color=fff`
      });
      setUsers([...users, newUser]); // Cập nhật ngay User mới vào danh sách đang hiển thị
      setError(null);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thông tin User
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(id, userData);
      // Tìm trong mảng users và thay thế user cũ bằng user đã cập nhật
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      setError(null);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Xóa User
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await userService.deleteUser(id);
      // Lọc bỏ user có ID vừa xóa khỏi mảng State
      setUsers(users.filter(u => u.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra đăng nhập (Username & Password)
  const authenticateUser = async (username, password) => {
    try {
      setLoading(true);
      const user = await userService.authenticate(username, password);
      setError(null);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Đóng gói các biến và hàm để các Component con có thể sử dụng
  const value = {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    authenticateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// 4. Custom Hook để các Component khác gọi dữ liệu User nhanh hơn
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}