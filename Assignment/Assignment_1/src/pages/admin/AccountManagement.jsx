import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import accountService from '../../services/accountService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Shield, User, Power } from 'lucide-react';

const AccountManagement = () => {
    const { user: currentUser } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const validationSchema = Yup.object({
        accountName: Yup.string().required('Name is required'),
        accountEmail: Yup.string().email('Invalid email').required('Email is required'),
        accountPassword: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
        accountRole: Yup.number().required('Role is required'),
        isActive: Yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            accountId: '',
            accountName: '',
            accountEmail: '',
            accountPassword: '',
            accountRole: 2,
            isActive: true
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = { 
                    ...values, 
                    accountRole: parseInt(values.accountRole),
                    updatedBy: currentUser?.accountName || 'System'
                };
                if (isEditMode) {
                    await accountService.updateAccount(values.accountId, payload);
                    toast.success('Account updated successfully!');
                } else {
                    await accountService.createAccount(payload);
                    toast.success('Account created successfully!');
                }
                setShowModal(false);
                fetchAccounts();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to save account.");
            }
        }
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const data = await accountService.getAllAccounts();
            if (Array.isArray(data)) {
                setAccounts(data);
            } else if (data && Array.isArray(data.content)) {
                setAccounts(data.content);
            } else {
                setAccounts([]);
            }
        } catch (error) {
            toast.error("Failed to load accounts.");
        } finally {
            setLoading(false);
        }
    };

    const handleShowCreate = () => {
        setIsEditMode(false);
        formik.resetForm();
        setShowModal(true);
    };

    const handleShowEdit = (acc) => {
        setIsEditMode(true);
        // Sanitize object to avoid uncontrolled input warning
        const sanitized = {
            accountId: acc.accountId || '',
            accountName: acc.accountName || '',
            accountEmail: acc.accountEmail || '',
            accountPassword: acc.accountPassword || '',
            accountRole: acc.accountRole || 2,
            isActive: acc.isActive ?? true
        };
        formik.setValues(sanitized);
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await accountService.deleteAccount(deleteId);
            toast.success('Account deleted successfully!');
            setShowDeleteModal(false);
            fetchAccounts();
        } catch (error) {
            toast.error(error.response?.data || "Cannot delete this account!");
        }
    };

    return (
        <div className="account-management-page">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Account Management</h2>
                    <p className="text-sm text-gray-500">Manage system administrators and staff accounts</p>
                </div>
                <button className="btn-premium btn-premium-primary" onClick={handleShowCreate}>
                    <Plus size={18} /> New Account
                </button>
            </div>

            {/* Table Area */}
            <div className="card-glass border-0 shadow-sm">
                {loading ? (
                    <div className="text-center py-12">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Loading accounts...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-premium mb-0">
                            <thead>
                                <tr>
                                    <th className="px-6">ID</th>
                                    <th>Profile</th>
                                    <th>Activity</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="text-end px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(accounts) && accounts.map((acc) => (
                                    <tr key={acc.accountId}>
                                        <td className="px-6 text-muted text-xs font-medium">#{acc.accountId}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
                                                    {acc.accountName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{acc.accountName}</div>
                                                    <div className="text-xs text-gray-500 font-medium">{acc.accountEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-xs text-blue-500 font-semibold">
                                                <span>{acc.updatedBy ? `By ${acc.updatedBy}` : 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {acc.accountRole === 1 ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-100 flex items-center gap-1.5 w-fit">
                                                    <Shield size={12} /> Admin
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1.5 w-fit">
                                                    <User size={12} /> Staff
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {acc.isActive ? (
                                                <span className="flex items-center gap-1.5 text-success font-bold text-[10px] uppercase tracking-wider">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all" onClick={() => handleShowEdit(acc)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 text-red-400 hover:bg-red-50 rounded transition-all" onClick={() => handleDeleteClick(acc.accountId)}>
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

            {/* --- MODAL THÊM / SỬA --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold">{isEditMode ? 'Update Account' : 'Create New Account'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={formik.handleSubmit}>
                    <Modal.Body className="px-4 pb-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Full Name</Form.Label>
                                    <Form.Control 
                                        name="accountName" 
                                        placeholder="John Doe"
                                        className={formik.touched.accountName && formik.errors.accountName ? 'is-invalid' : ''}
                                        {...formik.getFieldProps('accountName')}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.accountName}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Email Address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        name="accountEmail" 
                                        placeholder="john@example.com"
                                        disabled={isEditMode}
                                        className={formik.touched.accountEmail && formik.errors.accountEmail ? 'is-invalid' : ''}
                                        {...formik.getFieldProps('accountEmail')}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.accountEmail}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        name="accountPassword" 
                                        placeholder="••••••••"
                                        className={formik.touched.accountPassword && formik.errors.accountPassword ? 'is-invalid' : ''}
                                        {...formik.getFieldProps('accountPassword')}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.accountPassword}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">System Role</Form.Label>
                                    <Form.Select 
                                        name="accountRole"
                                        className={formik.touched.accountRole && formik.errors.accountRole ? 'is-invalid' : ''}
                                        {...formik.getFieldProps('accountRole')}
                                    >
                                        <option value="1">Administrator</option>
                                        <option value="2">Staff Member</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formik.errors.accountRole}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-4">
                                <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="fw-bold small">Account Status</div>
                                        <div className="text-muted smaller">Enable or disable this account's access to the system</div>
                                    </div>
                                    <Form.Check 
                                        type="switch" 
                                        id="isActive"
                                        className="custom-switch"
                                        checked={formik.values.isActive}
                                        onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 px-4 pb-4">
                        <Button variant="light" className="px-4 fw-semibold" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-4 fw-semibold" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? <Spinner size="sm" animation="border" /> : (isEditMode ? 'Save Changes' : 'Create Account')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* --- MODAL CONFIRM DELETE --- */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Body className="p-4 text-center">
                    <div className="mb-3 text-danger bg-danger bg-opacity-10 d-inline-block p-3 rounded-circle">
                        <Trash2 size={32} />
                    </div>
                    <h4 className="fw-bold">Delete Account?</h4>
                    <p className="text-muted">Are you sure you want to delete this account? This action cannot be reversed.</p>
                    <div className="d-flex gap-2 justify-content-center mt-4">
                        <Button variant="light" className="px-4 fw-semibold" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" className="px-4 fw-semibold" onClick={confirmDelete}>Delete Anyway</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AccountManagement;
