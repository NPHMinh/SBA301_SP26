import React, { createContext, useContext, useState } from 'react';
import { UsersData } from '../shared/UserData'; // Dữ liệu người dùng mẫu ban đầu

// 1. Khởi tạo Context để quản lý danh sách người dùng
const UserContext = createContext(null);

export function UserProvider({ children }) {
  // 2. State lưu trữ danh sách người dùng toàn cục
  const [users, setUsers] = useState(UsersData);

  // --- Các hàm xử lý dữ liệu (Business Logic) ---

  // Lấy toàn bộ danh sách người dùng
  const getAllUsers = () => {
    return users;
  };

  // Tìm người dùng dựa trên ID (ví dụ: dùng cho trang Profile)
  const getUserById = (id) => {
    return users.find(u => u.id === id);
  };

  // Tìm người dùng theo tên đăng nhập
  const getUserByUsername = (username) => {
    return users.find(u => u.username === username);
  };

  // 3. Thêm người dùng mới (Đăng ký)
  const addUser = (userData) => {
    const newUser = {
      // Tạo ID tự động dựa trên độ dài mảng (Lưu ý: thực tế nên dùng UUID hoặc ID từ Backend)
      id: String(users.length + 1),
      ...userData,
      // Tự động tạo ảnh đại diện (avatar) dựa trên tên người dùng bằng API ui-avatars
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random&color=fff`
    };
    // Cập nhật state bằng cách tạo mảng mới kết hợp mảng cũ và user mới
    setUsers([...users, newUser]);
    return newUser;
  };

  // 4. Cập nhật thông tin người dùng
  const updateUser = (id, userData) => {
    // Duyệt mảng: nếu đúng ID thì ghi đè dữ liệu mới, nếu không thì giữ nguyên
    setUsers(users.map(u => u.id === id ? { ...u, ...userData } : u));
  };

  // 5. Xóa người dùng
  const deleteUser = (id) => {
    // Lọc ra những người dùng có ID khác với ID cần xóa
    setUsers(users.filter(u => u.id !== id));
  };

  // 6. Xác thực đăng nhập (Authentication)
  // Kiểm tra cặp tài khoản/mật khẩu có khớp với dữ liệu trong hệ thống hay không
  const authenticateUser = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    return user || null; // Trả về object người dùng nếu đúng, ngược lại trả về null
  };

  // 7. Tập hợp các giá trị và hàm để cung cấp cho ứng dụng
  const value = {
    users,
    getAllUsers,
    getUserById,
    getUserByUsername,
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

/**
 * 8. Custom Hook useUser:
 * Giúp các component con truy cập các hàm xử lý người dùng dễ dàng.
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}