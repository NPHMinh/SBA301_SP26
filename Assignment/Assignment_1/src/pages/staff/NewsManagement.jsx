import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge, Spinner, Card } from 'react-bootstrap';
import axiosClient from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, FileText, Globe, Calendar, CheckCircle, XCircle, User } from 'lucide-react';

const NewsManagement = () => {
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        newsArticleId: '', newsTitle: '', headline: '', newsContent: '', newsSource: '', newsStatus: true,
        category: { categoryId: '' }, createdBy: { accountId: user?.accountId }
    });

    useEffect(() => {
        fetchNews();
        fetchCategories();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/news'); 
            console.log("News API Response:", res.data);
            if (Array.isArray(res.data)) {
                setNews(res.data);
            } else if (res.data && Array.isArray(res.data.content)) {
                setNews(res.data.content);
            } else {
                setNews([]);
            }
        } catch (err) {
            toast.error("Failed to load news articles.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get('/categories');
            console.log("Categories API Response:", res.data);
            let data = [];
            if (Array.isArray(res.data)) {
                data = res.data;
            } else if (res.data && Array.isArray(res.data.content)) {
                data = res.data.content;
            }
            setCategories(data);
            if (data.length > 0 && !formData.category.categoryId) {
                setFormData(prev => ({ ...prev, category: { categoryId: data[0].categoryId } }));
            }
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    const handleSave = async () => {
        if (!formData.newsTitle || !formData.headline || !formData.newsContent) {
            return toast.warn("Please fill in all required fields.");
        }

        const payload = {
            ...formData,
            category: { categoryId: parseInt(formData.category.categoryId) },
            createdBy: isEdit ? formData.createdBy : { accountId: user.accountId },
            updatedBy: { accountId: user?.accountId, accountName: user?.accountName }
        };

        setSaving(true);
        try {
            if (isEdit) {
                await axiosClient.put(`/news/${formData.newsArticleId}`, payload);
                toast.success("Article updated successfully!");
            } else {
                await axiosClient.post('/news', payload);
                toast.success("Article published!");
            }
            setShowModal(false);
            fetchNews();
        } catch (err) { 
            toast.error("Error saving news article."); 
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this news article?")) {
            try {
                await axiosClient.delete(`/news/${id}`);
                toast.success("Article deleted.");
                fetchNews();
            } catch (err) {
                toast.error("Failed to delete article.");
            }
        }
    };

    return (
        <div className="news-management-page">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">News Management</h2>
                    <p className="text-sm text-gray-500">Publish and manage news articles for the system</p>
                </div>
                <button 
                    className="btn-premium btn-premium-primary"
                    onClick={() => { setIsEdit(false); setFormData({ ...formData, newsArticleId: '', newsTitle: '', headline: '', newsContent: '', newsSource: '', newsStatus: true, category: { categoryId: categories[0]?.categoryId } }); setShowModal(true); }}
                >
                    <Plus size={18} /> Publish News
                </button>
            </div>

            {/* Table Area */}
            <div className="card-glass border-0 shadow-sm">
                {loading ? (
                    <div className="text-center py-12">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Loading articles...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-premium mb-0">
                            <thead>
                                <tr>
                                    <th className="px-6">Article</th>
                                    <th>Category</th>
                                    <th>Activity</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-end px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(news) && news.map(n => (
                                    <tr key={n.newsArticleId}>
                                        <td className="px-6 py-4" style={{ minWidth: '320px' }}>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-900 text-base leading-snug">{n.newsTitle}</span>
                                                <span className="text-xs text-blue-500 font-medium line-clamp-1 opacity-80">{n.headline}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="px-2.5 py-1.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100 w-fit">
                                                {n.category?.categoryName}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col gap-1 text-[11px] text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe size={12} className="opacity-50" /> 
                                                    <span>{n.newsSource || 'Local Source'}</span>
                                                </div>
                                                <div className="text-blue-500 font-semibold">
                                                    {n.updatedBy?.accountName 
                                                        ? `Updated By ${n.updatedBy.accountName}` 
                                                        : (n.createdBy?.accountName ? `Created By ${n.createdBy.accountName}` : 'System')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {n.newsStatus ? (
                                                <span className="inline-flex items-center gap-1.5 text-success font-bold text-[10px] uppercase tracking-wider">
                                                    <CheckCircle size={14} /> Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                                                    <XCircle size={14} /> Hidden
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all" 
                                                    onClick={() => { setIsEdit(true); setFormData(n); setShowModal(true); }}
                                                    title="Edit Article"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" 
                                                    onClick={() => handleDelete(n.newsArticleId)}
                                                    title="Delete Article"
                                                >
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

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold">{isEdit ? 'Edit' : 'Create'} News Article</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <div className="row g-3">
                            <div className="col-12">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Article Title</Form.Label>
                                    <Form.Control 
                                        placeholder="Enter compelling title"
                                        value={formData.newsTitle || ''} 
                                        onChange={e => setFormData({ ...formData, newsTitle: e.target.value })} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Headline</Form.Label>
                                    <Form.Control 
                                        placeholder="Brief summary"
                                        value={formData.headline || ''} 
                                        onChange={e => setFormData({ ...formData, headline: e.target.value })} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Category</Form.Label>
                                    <Form.Select 
                                        value={formData.category?.categoryId || ''} 
                                        onChange={e => setFormData({ ...formData, category: { categoryId: e.target.value } })}
                                    >
                                        {Array.isArray(categories) && categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Content</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={5} 
                                        placeholder="Write your article here..."
                                        value={formData.newsContent || ''} 
                                        onChange={e => setFormData({ ...formData, newsContent: e.target.value })} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">News Source</Form.Label>
                                    <Form.Control 
                                        placeholder="e.g. CNN, BBC, or Internal"
                                        value={formData.newsSource || ''} 
                                        onChange={e => setFormData({ ...formData, newsSource: e.target.value })} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 d-flex align-items-end">
                                <div className="bg-light p-2 rounded-3 w-100 d-flex justify-content-between align-items-center">
                                    <span className="small fw-bold ms-2">Published</span>
                                    <Form.Check 
                                        type="switch" 
                                        id="news-status"
                                        checked={formData.newsStatus} 
                                        onChange={e => setFormData({ ...formData, newsStatus: e.target.checked })} 
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4">
                    <Button variant="light" className="px-4 fw-semibold" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" className="px-4 fw-semibold d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
                        {saving ? <Spinner size="sm" animation="border" /> : (isEdit ? <><Edit2 size={16} /> Update Article</> : <><Plus size={16} /> Publish Article</>)}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default NewsManagement;
