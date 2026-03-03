import React, { useState, useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import axiosClient from '../../api/axiosConfig';
import { User, Mail, Lock, Eye, EyeOff, Shield, AlertCircle, ChevronDown, ChevronUp, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../assets/styles/UserProfile.css';

const UserProfile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [formData, setFormData] = useState({ accountId: '', accountName: '', accountEmail: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (authUser) {
            fetchUserData();
        }
    }, [authUser]);

    const fetchUserData = async () => {
        try {
            const res = await axiosClient.get(`/accounts/${authUser.accountId}`);
            const { accountPassword, ...userWithoutPassword } = res.data;
            setFormData(userWithoutPassword);
        } catch (err) {
            toast.error('Failed to load profile data');
        }
    };

    const sanitizeInput = (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    };

    const validateName = (name) => {
        if (!name || name.trim().length === 0) return 'Name is required';
        if (name.trim().length < 2) return 'Name must be at least 2 characters';
        if (name.trim().length > 50) return 'Name must not exceed 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
        return null;
    };

    const calculatePasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[a-z]/.test(password)) return 'Password must contain lowercase letter';
        if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain number';
        if (!/[^a-zA-Z0-9]/.test(password)) return 'Password must contain special character';
        return null;
    };

    const handleNameChange = (e) => {
        const value = sanitizeInput(e.target.value);
        setFormData({ ...formData, accountName: value });
        setHasChanges(true);

        const error = validateName(value);
        setErrors({ ...errors, accountName: error });
    };

    const handlePasswordChange = (field, value) => {
        const newPasswordData = { ...passwordData, [field]: value };
        setPasswordData(newPasswordData);

        if (field === 'newPassword') {
            const strength = calculatePasswordStrength(value);
            setPasswordStrength(strength);
            const error = validatePassword(value);
            setErrors({ ...errors, newPassword: error });
        }

        if (field === 'confirmPassword') {
            const error = value !== newPasswordData.newPassword ? 'Passwords do not match' : null;
            setErrors({ ...errors, confirmPassword: error });
        }
    };

    const handleProfileUpdate = async () => {
        const nameError = validateName(formData.accountName);
        if (nameError) {
            setErrors({ ...errors, accountName: nameError });
            toast.error(nameError);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                accountRole: authUser.accountRole,
                isActive: true
            };

            const res = await axiosClient.put(`/accounts/${formData.accountId}`, payload);
            const { accountPassword, ...userWithoutPassword } = res.data;

            updateUser(userWithoutPassword);
            setHasChanges(false);
            setShowConfirmModal(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwordData.currentPassword) {
            toast.error('Current password is required');
            return;
        }

        const newPasswordError = validatePassword(passwordData.newPassword);
        if (newPasswordError) {
            toast.error(newPasswordError);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            toast.error('New password must be different from current password');
            return;
        }

        setLoading(true);
        try {
            await axiosClient.post('/accounts/login', {
                accountEmail: formData.accountEmail,
                accountPassword: passwordData.currentPassword
            });

            await axiosClient.put(`/accounts/${formData.accountId}`, {
                ...formData,
                accountPassword: passwordData.newPassword,
                accountRole: authUser.accountRole,
                isActive: true
            });

            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordSection(false);
            setPasswordStrength({ score: 0, label: '', color: '' });
            toast.success('Password changed successfully!');
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Current password is incorrect');
            } else {
                toast.error('Failed to change password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-profile-page">
            <div className="profile-container">
                <div className="profile-card">
                    {/* Modern Header with Gradient */}
                    <div className="profile-header">
                        <div className="header-content">
                            <div className="avatar-wrapper">
                                <div className="avatar-circle">
                                    <span className="avatar-text">
                                        {formData.accountName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="avatar-status"></div>
                            </div>
                            <div className="header-info">
                                <h1 className="profile-name">{formData.accountName || 'User Profile'}</h1>
                                <div className="profile-badge">
                                    <Shield size={14} />
                                    <span>Account Settings</span>
                                </div>
                            </div>
                        </div>
                        <div className="header-decoration"></div>
                    </div>

                    <div className="profile-body">
                        {/* Profile Information Section */}
                        <div className="section">
                            <div className="section-header">
                                <div className="section-title">
                                    <User size={20} />
                                    <h2>Profile Information</h2>
                                </div>
                            </div>

                            <div className="form-grid">
                                {/* Account ID */}
                                <div className="form-group readonly">
                                    <label className="form-label">Account ID</label>
                                    <div className="input-readonly">
                                        <span className="readonly-badge">#{formData.accountId}</span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="form-group readonly">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-readonly">
                                        <Mail size={16} />
                                        <span>{formData.accountEmail}</span>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="form-group full-width">
                                    <label className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <User size={18} className="input-icon" />
                                        <input
                                            className={`form-input ${errors.accountName ? 'error' : ''} ${hasChanges && !errors.accountName ? 'success' : ''}`}
                                            value={formData.accountName || ''}
                                            onChange={handleNameChange}
                                            placeholder="Enter your full name"
                                        />
                                        {hasChanges && !errors.accountName && (
                                            <CheckCircle2 size={18} className="input-icon-right success-icon" />
                                        )}
                                    </div>
                                    {errors.accountName && (
                                        <div className="error-message">
                                            <AlertCircle size={12} />
                                            <span>{errors.accountName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                className={`btn-save ${hasChanges && !errors.accountName ? 'active' : ''}`}
                                onClick={() => setShowConfirmModal(true)}
                                disabled={!hasChanges || !!errors.accountName || loading}
                            >
                                {loading ? (
                                    <Spinner size="sm" animation="border" />
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="section-divider"></div>

                        {/* Change Password Section */}
                        <div className="section">
                            <button
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                                className="section-toggle"
                            >
                                <div className="toggle-left">
                                    <Lock size={20} />
                                    <span>Change Password</span>
                                </div>
                                <div className={`toggle-icon ${showPasswordSection ? 'active' : ''}`}>
                                    {showPasswordSection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </button>

                            {showPasswordSection && (
                                <div className="password-section">
                                    {/* Current Password */}
                                    <div className="form-group">
                                        <label className="form-label">
                                            Current Password <span className="required">*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <Lock size={18} className="input-icon" />
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="form-input"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="password-toggle"
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="form-group">
                                        <label className="form-label">
                                            New Password <span className="required">*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <Lock size={18} className="input-icon" />
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="password-toggle"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>

                                        {/* Password Strength */}
                                        {passwordData.newPassword && (
                                            <div className="password-strength">
                                                <div className="strength-header">
                                                    <span>Password Strength</span>
                                                    <span className={`strength-label ${passwordStrength.label.toLowerCase()}`}>
                                                        {passwordStrength.label}
                                                    </span>
                                                </div>
                                                <div className="strength-bar">
                                                    <div
                                                        className={`strength-fill ${passwordStrength.label.toLowerCase()}`}
                                                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {errors.newPassword && (
                                            <div className="error-message">
                                                <AlertCircle size={12} />
                                                <span>{errors.newPassword}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="form-group">
                                        <label className="form-label">
                                            Confirm New Password <span className="required">*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <Lock size={18} className="input-icon" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="password-toggle"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <div className="error-message">
                                                <AlertCircle size={12} />
                                                <span>{errors.confirmPassword}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="btn-save btn-password"
                                        onClick={handlePasswordUpdate}
                                        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || !!errors.newPassword || !!errors.confirmPassword || loading}
                                    >
                                        {loading ? (
                                            <Spinner size="sm" animation="border" />
                                        ) : (
                                            <>
                                                <Lock size={18} />
                                                <span>Update Password</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <div className="custom-modal">
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            <CheckCircle2 size={24} className="modal-icon" />
                            Confirm Profile Update
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        <p className="modal-description">
                            Are you sure you want to update your profile information?
                        </p>
                        <div className="modal-changes">
                            <div className="change-item">
                                <User size={16} />
                                <div>
                                    <span className="change-label">Full Name</span>
                                    <span className="change-value">{formData.accountName}</span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <button
                            className="modal-btn modal-btn-cancel"
                            onClick={() => setShowConfirmModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="modal-btn modal-btn-confirm"
                            onClick={handleProfileUpdate}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : 'Confirm Update'}
                        </button>
                    </Modal.Footer>
                </div>
            </Modal>

        </div>
    );
};

export default UserProfile;