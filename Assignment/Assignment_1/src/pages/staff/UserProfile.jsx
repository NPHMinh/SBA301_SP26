import React, { useState, useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import axiosClient from '../../api/axiosConfig';
import { User, Mail, Lock, CheckCircle, XCircle, Eye, EyeOff, Shield, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

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

    // Sanitize input to prevent XSS
    const sanitizeInput = (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    };

    // Validate name
    const validateName = (name) => {
        if (!name || name.trim().length === 0) {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (name.trim().length > 50) {
            return 'Name must not exceed 50 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return 'Name can only contain letters and spaces';
        }
        return null;
    };

    // Calculate password strength
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

    // Validate password
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
        // Validate
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
        // Validate all password fields
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
            // Verify current password by attempting login
            await axiosClient.post('/accounts/login', {
                accountEmail: formData.accountEmail,
                accountPassword: passwordData.currentPassword
            });

            // Update password
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
        <div className="user-profile-page flex justify-center py-8 px-4">
            <div className="card-glass w-full max-w-2xl shadow-lg border-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-bold backdrop-blur-sm border-2 border-white border-opacity-30">
                            {formData.accountName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-1">{formData.accountName || 'User'}</h2>
                            <p className="text-blue-100 text-sm opacity-90 font-medium flex items-center gap-2">
                                <Shield size={14} />
                                Account Settings
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-white">
                    {/* Profile Information Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Profile Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account ID */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Account ID
                                </label>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-medium">
                                    #{formData.accountId}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Email Address
                                </label>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-medium flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    {formData.accountEmail}
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.accountName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'} focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all`}
                                        value={formData.accountName || ''} 
                                        onChange={handleNameChange}
                                        placeholder="Enter your full name"
                                        aria-label="Full Name"
                                        aria-invalid={!!errors.accountName}
                                        aria-describedby={errors.accountName ? "name-error" : undefined}
                                    />
                                </div>
                                {errors.accountName && (
                                    <p id="name-error" className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.accountName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button 
                            className="btn-premium btn-premium-primary w-full mt-6 py-3 uppercase tracking-widest text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setShowConfirmModal(true)}
                            disabled={!hasChanges || !!errors.accountName || loading}
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : 'Update Profile'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8"></div>

                    {/* Change Password Section */}
                    <div>
                        <button
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200"
                        >
                            <div className="flex items-center gap-3">
                                <Lock size={20} className="text-indigo-600" />
                                <span className="text-lg font-bold text-gray-900">Change Password</span>
                            </div>
                            {showPasswordSection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {showPasswordSection && (
                            <div className="mt-6 space-y-6 p-6 bg-indigo-50/30 rounded-xl border border-indigo-100">
                                {/* Current Password */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                        Current Password *
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type={showCurrentPassword ? "text" : "password"}
                                            className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all"
                                            value={passwordData.currentPassword} 
                                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                            placeholder="Enter current password"
                                            aria-label="Current Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                        >
                                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type={showNewPassword ? "text" : "password"}
                                            className={`w-full pl-11 pr-12 py-3 bg-white border ${errors.newPassword ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'} focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all`}
                                            value={passwordData.newPassword} 
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                            placeholder="Enter new password"
                                            aria-label="New Password"
                                            aria-invalid={!!errors.newPassword}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    {passwordData.newPassword && (
                                        <div className="mt-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-gray-600">Password Strength:</span>
                                                <span className={`text-xs font-bold ${
                                                    passwordStrength.label === 'Weak' ? 'text-red-600' :
                                                    passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                                                    'text-green-600'
                                                }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {errors.newPassword && (
                                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.newPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                        Confirm New Password *
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={`w-full pl-11 pr-12 py-3 bg-white border ${errors.confirmPassword ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-indigo-400'} focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all`}
                                            value={passwordData.confirmPassword} 
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            placeholder="Confirm new password"
                                            aria-label="Confirm Password"
                                            aria-invalid={!!errors.confirmPassword}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                <button 
                                    className="btn-premium btn-premium-primary w-full py-3 uppercase tracking-widest text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handlePasswordUpdate}
                                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || !!errors.newPassword || !!errors.confirmPassword || loading}
                                >
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Change Password'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-lg font-bold">Confirm Profile Update</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <p className="text-gray-600">Are you sure you want to update your profile information?</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Changes:</p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Name:</span> {formData.accountName}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <button 
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:opacity-50"
                        onClick={handleProfileUpdate}
                        disabled={loading}
                    >
                        {loading ? <Spinner size="sm" animation="border" /> : 'Confirm Update'}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserProfile;