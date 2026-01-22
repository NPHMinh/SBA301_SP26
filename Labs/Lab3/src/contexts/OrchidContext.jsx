import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { orchidService } from '../api/orchidService';

const OrchidContext = createContext(null);

export function OrchidProvider({ children }) {
  // --- State quản lý dữ liệu gốc từ API ---
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- State quản lý UI (Tìm kiếm, Lọc, Sắp xếp) ---
  const [searchTerm, setSearchTerm] = useState('');      // Từ khóa tìm kiếm
  const [filterCategory, setFilterCategory] = useState('All'); // Danh mục đang chọn
  const [sortBy, setSortBy] = useState('name');          // Tiêu chí sắp xếp (tên/loại)

  // Lấy dữ liệu hoa lan khi app khởi động
  useEffect(() => {
    fetchOrchids();
  }, []);

  const fetchOrchids = async () => {
    try {
      setLoading(true);
      const data = await orchidService.getAllOrchids();
      setOrchids(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Tự động gom nhóm các Category duy nhất từ danh sách orchids để làm Menu lọc
  const categories = useMemo(() => {
    return ['All', ...new Set(orchids.map(o => o.category))];
  }, [orchids]);

  // 2. LOGIC QUAN TRỌNG: Tự động tính toán danh sách hiển thị dựa trên Tìm kiếm & Lọc
  const filteredOrchids = useMemo(() => {
    let result = [...orchids];

    // Lọc theo từ khóa (tên hoa hoặc danh mục)
    if (searchTerm) {
      result = result.filter(orchid =>
        orchid.orchidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orchid.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo danh mục đã chọn
    if (filterCategory !== 'All') {
      result = result.filter(orchid => orchid.category === filterCategory);
    }

    // Sắp xếp danh sách (theo tên A-Z hoặc theo loại)
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.orchidName.localeCompare(b.orchidName);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [orchids, searchTerm, filterCategory, sortBy]); // Chạy lại mỗi khi 1 trong các giá trị này thay đổi

  // --- Các hàm CRUD (Tương tự như UserContext) ---

  const getOrchidById = async (id) => {
    try {
      return await orchidService.getOrchidById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addOrchid = async (orchidData) => {
    try {
      setLoading(true);
      const newOrchid = await orchidService.createOrchid(orchidData);
      setOrchids([...orchids, newOrchid]); // Thêm vào mảng gốc
      return newOrchid;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrchid = async (id, orchidData) => {
    try {
      setLoading(true);
      const updatedOrchid = await orchidService.updateOrchid(id, orchidData);
      setOrchids(orchids.map(o => o.id === id ? updatedOrchid : o)); // Cập nhật mảng gốc
      return updatedOrchid;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrchid = async (id) => {
    try {
      setLoading(true);
      await orchidService.deleteOrchid(id);
      setOrchids(orchids.filter(o => o.id !== id)); // Xóa khỏi mảng gốc
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Export tất cả dữ liệu và hàm điều khiển
  const value = {
    orchids,           // Mảng gốc
    filteredOrchids,   // Mảng đã qua bộ lọc (Dùng để hiển thị lên giao diện)
    categories,        // Danh sách các loại hoa (Dùng cho dropdown filter)
    loading,
    error,
    searchTerm,
    setSearchTerm,     // Hàm để cập nhật ô Search
    filterCategory,
    setFilterCategory, // Hàm để chọn Category
    sortBy,
    setSortBy,         // Hàm để chọn kiểu sắp xếp
    fetchOrchids,
    getOrchidById,
    addOrchid,
    updateOrchid,
    deleteOrchid
  };

  return (
    <OrchidContext.Provider value={value}>
      {children}
    </OrchidContext.Provider>
  );
}

export function useOrchid() {
  const context = useContext(OrchidContext);
  if (!context) {
    throw new Error('useOrchid must be used within OrchidProvider');
  }
  return context;
}