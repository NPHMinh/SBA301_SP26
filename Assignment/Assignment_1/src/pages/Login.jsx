import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../assets/styles/Login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(3, 'Password must be at least 3 characters').required('Password is required')
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const response = await accountService.login(values);
                const { token, ...userData } = response;
                
                login(userData, token);
                toast.success(`Welcome back, ${userData.accountName}!`);
                
                if (userData.accountRole === 1) navigate('/admin/accounts');
                else navigate('/staff/news');
            } catch (err) {
                setStatus('Invalid email or password. Please try again.');
                toast.error('Login failed. Please check your credentials.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="login-page">
            <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
                <Card className="login-card shadow-lg border-0">
                    <Card.Body className="p-5">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="logo-circle mx-auto mb-3">
                                <span className="logo-text">FU</span>
                            </div>
                            <h2 className="fw-bold mb-2 text-dark">Welcome to FUNews</h2>
                            <p className="text-muted mb-0">Sign in to continue to your account</p>
                        </div>

                        {/* Error Alert */}
                        {formik.status && (
                            <Alert variant="danger" className="py-3 mb-4 d-flex align-items-center border-0 alert-modern">
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                {formik.status}
                            </Alert>
                        )}

                        {/* Login Form */}
                        <Form onSubmit={formik.handleSubmit}>
                            {/* Email Field */}
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-dark mb-2">
                                    Email Address
                                </Form.Label>
                                <div className="input-group-modern">
                                    <span className="input-icon">
                                        <FiMail size={18} />
                                    </span>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className={`form-control-modern ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('email')}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-danger small mt-1">
                                        <i className="bi bi-exclamation-circle me-1"></i>
                                        {formik.errors.email}
                                    </div>
                                )}
                            </Form.Group>

                            {/* Password Field */}
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-dark mb-2">
                                    Password
                                </Form.Label>
                                <div className="input-group-modern">
                                    <span className="input-icon">
                                        <FiLock size={18} />
                                    </span>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        className={`form-control-modern ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('password')}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-danger small mt-1">
                                        <i className="bi bi-exclamation-circle me-1"></i>
                                        {formik.errors.password}
                                    </div>
                                )}
                            </Form.Group>

                            {/* Submit Button */}
                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 py-3 fw-semibold btn-modern"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? (
                                    <>
                                        <Spinner size="sm" animation="border" className="me-2" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </>
                                )}
                            </Button>
                        </Form>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <p className="text-muted small mb-0">
                                Protected by FUNews Security • Version 1.0
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;