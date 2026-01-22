import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Tạo Context: Một "trung tâm lưu trữ" dữ liệu đăng nhập cho cả ứng dụng
const AuthContext = createContext(null);

// 2. AuthProvider: Thành phần bao bọc ứng dụng để cung cấp dữ liệu cho các component con
export function AuthProvider({ children }) {
  const navigate = useNavigate(); // Hook để điều hướng trang
  
  // 3. Khởi tạo trạng thái đăng nhập từ localStorage
  // Dùng callback trong useState để chỉ đọc từ bộ nhớ máy tính 1 lần duy nhất khi khởi tạo
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true'; // Chuyển kiểu String từ storage về kiểu Boolean
  });

  // 4. Khởi tạo thông tin người dùng từ localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    // Nếu có dữ liệu thì chuyển từ JSON String về Object, ngược lại trả về null
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 5. useEffect: Theo dõi sự thay đổi của isLoggedIn và user để cập nhật localStorage
  // Giúp trạng thái đăng nhập được đồng bộ liên tục với bộ nhớ trình duyệt
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Object phải chuyển về chuỗi JSON
    } else {
      localStorage.removeItem('user'); // Xóa sạch dữ liệu khi user là null
    }
  }, [isLoggedIn, user]);

  // 6. Hàm Login: Thiết lập trạng thái khi người dùng đăng nhập thành công
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser({
      ...userData, // Lưu các thông tin như username, role, email...
      loginTime: new Date().toISOString() // Lưu thêm thời điểm đăng nhập
    });
    navigate('/orchids'); // Tự động chuyển đến trang danh sách hoa
  };

  // 7. Hàm Logout: Xóa sạch trạng thái và bộ nhớ
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/'); // Quay về trang chủ (hoặc trang login)
  };

  // 8. Hàm kiểm tra quyền Admin: 
  // Trả về true nếu người dùng tồn tại và có thuộc tính role là 'admin'
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // 9. Object chứa tất cả dữ liệu muốn chia sẻ cho các component con
  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    isAdmin
  };

  // Trả về Provider cung cấp giá trị cho toàn bộ cây component con ({children})
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 10. Custom Hook useAuth:
 * Giúp các component khác lấy dữ liệu đăng nhập một cách ngắn gọn.
 * Ví dụ: const { user, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Kiểm tra an toàn để đảm bảo Hook này được dùng bên trong AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}