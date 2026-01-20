import React, { createContext, useContext, useState, useMemo } from 'react';
import { OrchidsData } from '../shared/ListOfOrchids'; // Nhập dữ liệu thô từ file danh sách có sẵn

// 1. Tạo Context để quản lý thông tin về hoa lan
const OrchidContext = createContext(null);

export function OrchidProvider({ children }) {
  // --- Các State quản lý tiêu chí lọc và sắp xếp ---
  const [searchTerm, setSearchTerm] = useState('');     // Từ khóa tìm kiếm
  const [filterCategory, setFilterCategory] = useState('All'); // Loại hoa cần lọc (Vd: Cattleya, Dendrobium...)
  const [sortBy, setSortBy] = useState('name');         // Tiêu chí sắp xếp (theo tên hoặc theo loại)

  // 2. Tự động trích xuất danh sách các "Loại hoa" duy nhất từ dữ liệu gốc
  // useMemo giúp tính toán lại chỉ khi dữ liệu OrchidsData thay đổi
  const categories = useMemo(() => {
    // Set sẽ loại bỏ các tên loại trùng lặp
    return ['All', ...new Set(OrchidsData.map(o => o.category))];
  }, []);

  // 3. Logic xử lý dữ liệu (Lọc & Sắp xếp)
  // Đây là phần quan trọng nhất: Tạo ra danh sách hoa lan đã qua bộ lọc
  const filteredOrchids = useMemo(() => {
    let result = [...OrchidsData]; // Tạo bản sao của dữ liệu gốc để xử lý

    // BƯỚC A: Lọc theo từ khóa tìm kiếm (Search)
    if (searchTerm) {
      result = result.filter(orchid =>
        orchid.orchidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orchid.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // BƯỚC B: Lọc theo danh mục (Category)
    if (filterCategory !== 'All') {
      result = result.filter(orchid => orchid.category === filterCategory);
    }

    // BƯỚC C: Sắp xếp (Sort)
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.orchidName.localeCompare(b.orchidName); // So sánh chuỗi theo bảng chữ cái
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [searchTerm, filterCategory, sortBy]); // Chỉ tính toán lại khi 1 trong 3 giá trị này thay đổi

  // 4. Hàm bổ trợ: Lấy thông tin chi tiết của 1 cây lan theo ID
  const getOrchidById = (id) => {
    return OrchidsData.find(o => o.id === id);
  };

  // 5. Gom tất cả các biến và hàm vào một object để cung cấp cho toàn ứng dụng
  const value = {
    searchTerm,        // Biến: từ khóa hiện tại
    setSearchTerm,     // Hàm: cập nhật từ khóa
    filterCategory,    // Biến: danh mục đang chọn
    setFilterCategory, // Hàm: cập nhật danh mục
    sortBy,            // Biến: kiểu sắp xếp
    setSortBy,         // Hàm: cập nhật kiểu sắp xếp
    categories,        // Biến: danh sách các danh mục để hiển thị lên Menu/Dropdown
    filteredOrchids,   // Biến: DANH SÁCH CUỐI CÙNG (đã lọc & sắp xếp) để hiển thị lên UI
    allOrchids: OrchidsData,
    getOrchidById
  };

  return (
    <OrchidContext.Provider value={value}>
      {children}
    </OrchidContext.Provider>
  );
}

// 6. Custom hook để các Component (như SearchBar, List, Home) sử dụng dữ liệu nhanh chóng
export function useOrchid() {
  const context = useContext(OrchidContext);
  if (!context) {
    throw new Error('useOrchid must be used within OrchidProvider');
  }
  return context;
}