import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge, Spinner } from 'react-bootstrap';
import axiosClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Folder, Power, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CategoryManagement = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ categoryId: '', categoryName: '', categoryDescription: '', isActive: true, updatedBy: null });
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/categories');
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            } else if (res.data && Array.isArray(res.data.content)) {
                setCategories(res.data.content);
            } else {
                setCategories([]);
            }
        } catch (err) {
            toast.error("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.categoryName.trim()) {
            return toast.warn("Category name is required.");
        }
        setSaving(true);
        try {
            const payload = {
                ...formData,
                updatedBy: user?.accountName || 'System'
            };

            if (isEdit) {
                console.log("Updating category with payload:", payload);
                const res = await axiosClient.put(`/categories/${formData.categoryId}`, payload);
                console.log("Update response:", res.data);
                toast.success("Category updated!");
            } else {
                console.log("Creating category with payload:", payload);
                const res = await axiosClient.post('/categories', payload);
                console.log("Create response:", res.data);
                toast.success("Category created!");
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) { 
            toast.error("Error saving category."); 
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axiosClient.delete(`/categories/${id}`);
                toast.success("Category deleted.");
                fetchCategories();
            } catch (err) { 
                toast.error("Cannot delete! Category is in use."); 
            }
        }
    };

    return (
        <div className="category-management-page">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Category Management</h2>
                    <p className="text-sm text-gray-500">Organize and manage system categories</p>
                </div>
                <button 
                    className="btn-premium btn-premium-primary"
                    onClick={() => { setIsEdit(false); setFormData({ categoryId: '', categoryName: '', categoryDescription: '', isActive: true }); setShowModal(true); }}
                >
                    <Plus size={18} /> New Category
                </button>
            </div>

            {/* Table Area */}
            <div className="card-glass border-0 shadow-sm">
                {loading ? (
                    <div className="text-center py-12">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Loading categories...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-premium mb-0">
                            <thead>
                                <tr>
                                    <th className="px-6">ID</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Activity</th>
                                    <th>Status</th>
                                    <th className="text-end px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(categories) && categories.map(c => (
                                    <tr key={c.categoryId}>
                                        <td className="px-6 text-muted text-xs font-medium">#{c.categoryId}</td>
                                        <td className="py-4">
                                            <span className="font-semibold text-gray-900 block">{c.categoryName}</span>
                                        </td>
                                        <td>
                                            <p className="text-sm text-gray-600 mb-0 max-w-xs truncate">
                                                {c.categoryDescription || c.categoryDesciption}
                                            </p>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-xs text-blue-500 font-semibold mb-1">
                                                 {(() => {
                                                    // Handle both string and object formats
                                                    const updatedBy = typeof c.updatedBy === 'string' 
                                                        ? c.updatedBy 
                                                        : c.updatedBy?.accountName;
                                                    const createdBy = typeof c.createdBy === 'string'
                                                        ? c.createdBy
                                                        : c.createdBy?.accountName;
                                                    
                                                    return updatedBy 
                                                        ? `By ${updatedBy}` 
                                                        : (createdBy ? `By ${createdBy}` : 'System');
                                                })()}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {c.isActive ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-50 text-green-600 border border-green-100">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-50 text-gray-400 border border-gray-100">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end px-6">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                                    onClick={() => { 
                                                        setIsEdit(true); 
                                                        setFormData({
                                                            ...c,
                                                            categoryDescription: c.categoryDescription || c.categoryDesciption,
                                                            updatedBy: c.updatedBy
                                                        }); 
                                                        setShowModal(true); 
                                                    }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" onClick={() => handleDelete(c.categoryId)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold">{isEdit ? 'Edit' : 'Create'} Category</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Category Name</Form.Label>
                            <Form.Control 
                                placeholder="Enter name"
                                value={formData.categoryName || ''} 
                                onChange={e => setFormData({ ...formData, categoryName: e.target.value })} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Description</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={formData.categoryDescription || ''} 
                                onChange={e => setFormData({ ...formData, categoryDescription: e.target.value })} 
                            />
                        </Form.Group>
                        <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center">
                            <div className="fw-bold small">Active Status</div>
                            <Form.Check 
                                type="switch" 
                                id="cat-active"
                                checked={formData.isActive} 
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })} 
                            />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4">
                    <Button variant="light" className="px-4 fw-semibold" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" className="px-4 fw-semibold" onClick={handleSave} disabled={saving}>
                        {saving ? <Spinner size="sm" animation="border" /> : (isEdit ? 'Update' : 'Create')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default CategoryManagement;
