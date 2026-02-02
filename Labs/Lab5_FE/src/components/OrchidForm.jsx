import React, { useState, useEffect } from 'react';
import { categoryAPI, orchidAPI } from '../services/api';
import { toast } from 'react-toastify';
import './OrchidForm.css';

const OrchidForm = ({ orchid, onSave, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    orchidName: '',
    price: '',
    description: '',
    image: '',
    category: { id: '' }
  });

  useEffect(() => {
    loadCategories();
    
    if (orchid) {
      setFormData({
        orchidName: orchid.orchidName || '',
        price: orchid.price || '',
        description: orchid.description || '',
        image: orchid.image || '',
        category: { id: orchid.category?.id || '' }
      });
    }
  }, [orchid]);

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Không thể tải danh sách Category!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      setFormData({
        ...formData,
        category: { id: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.orchidName.trim()) {
      toast.error('Tên hoa lan không được để trống!');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error('Giá phải lớn hơn 0!');
      return;
    }

    if (!formData.category.id) {
      toast.error('Vui lòng chọn Category!');
      return;
    }

    try {
      if (orchid) {
        // Update
        await orchidAPI.update(orchid.orchidId, formData);
        toast.success('Cập nhật hoa lan thành công!');
      } else {
        // Create
        await orchidAPI.create(formData);
        toast.success('Thêm hoa lan mới thành công!');
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving orchid:', error);
      
      // Hiển thị lỗi từ backend
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="orchid-form">
      <h2>{orchid ? 'Cập nhật Hoa Lan' : 'Thêm Hoa Lan Mới'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="orchidName">Tên Hoa Lan *</label>
          <input
            type="text"
            id="orchidName"
            name="orchidName"
            value={formData.orchidName}
            onChange={handleChange}
            placeholder="Nhập tên hoa lan"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Loại Hoa Lan *</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.category.id}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn loại hoa lan --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá (VNĐ) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Nhập giá"
            min="0"
            step="1000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL Hình ảnh</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Nhập URL hình ảnh"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {orchid ? 'Cập nhật' : 'Thêm mới'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrchidForm;