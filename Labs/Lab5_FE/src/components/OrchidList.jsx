import React, { useState, useEffect } from 'react';
import { orchidAPI, categoryAPI } from '../services/api';
import { toast } from 'react-toastify';
import OrchidForm from './OrchidForm';
import './OrchidList.css';

const OrchidList = () => {
  const [orchids, setOrchids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredOrchids, setFilteredOrchids] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOrchid, setEditingOrchid] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrchids();
    loadCategories();
  }, []);

  useEffect(() => {
    filterOrchids();
  }, [orchids, selectedCategory, searchTerm]);

  const loadOrchids = async () => {
    setLoading(true);
    try {
      const data = await orchidAPI.getAll();
      setOrchids(data);
      toast.success('Tải danh sách thành công!');
    } catch (error) {
      console.error('Error loading orchids:', error);
      const errorMessage = error.response?.data?.message || 'Không thể tải danh sách hoa lan!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Không thể tải danh sách Category!');
    }
  };

  const filterOrchids = () => {
    let filtered = orchids;

    // Lọc theo category
    if (selectedCategory) {
      filtered = filtered.filter(orchid => 
        orchid.category?.id === parseInt(selectedCategory)
      );
    }

    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(orchid =>
        orchid.orchidName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrchids(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hoa lan này?')) {
      try {
        await orchidAPI.delete(id);
        toast.success('Xóa hoa lan thành công!');
        loadOrchids();
      } catch (error) {
        console.error('Error deleting orchid:', error);
        const errorMessage = error.response?.data?.message || 'Không thể xóa hoa lan!';
        toast.error(errorMessage);
      }
    }
  };

  const handleEdit = (orchid) => {
    setEditingOrchid(orchid);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingOrchid(null);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingOrchid(null);
    loadOrchids();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrchid(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (showForm) {
    return (
      <OrchidForm
        orchid={editingOrchid}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="orchid-list-container">
      <div className="header">
        <h1>Quản Lý Hoa Lan</h1>
        <button className="btn btn-add" onClick={handleAdd}>
          + Thêm Hoa Lan Mới
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="categoryFilter">Lọc theo loại:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="searchInput">Tìm kiếm:</label>
          <input
            id="searchInput"
            type="text"
            placeholder="Nhập tên hoa lan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="orchid-count">
            Tổng số: {filteredOrchids.length} hoa lan
          </div>

          <div className="orchid-grid">
            {filteredOrchids.length === 0 ? (
              <div className="no-data">Không có dữ liệu</div>
            ) : (
              filteredOrchids.map((orchid) => (
                <div key={orchid.orchidId} className="orchid-card">
                  <div className="orchid-image">
                    {orchid.image ? (
                      <img src={orchid.image} alt={orchid.orchidName} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="orchid-info">
                    <h3>{orchid.orchidName}</h3>
                    
                    <div className="category-badge">
                      {orchid.category?.name || 'N/A'}
                    </div>

                    <p className="price">{formatPrice(orchid.price)}</p>

                    {orchid.description && (
                      <p className="description">{orchid.description}</p>
                    )}

                    <div className="card-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(orchid)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(orchid.orchidId)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrchidList;