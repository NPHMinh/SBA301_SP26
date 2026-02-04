import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import { toast } from 'react-toastify';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(3, 'Must be at least 3 characters').required('Required')
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const user = await accountService.login(values);
                login(user);
                toast.success(`Welcome back, ${user.accountName}!`);
                
                if (user.accountRole === 1) navigate('/admin/accounts');
                else navigate('/staff/news');
            } catch (err) {
                setStatus('Invalid Email or Password');
                toast.error('Login failed. Please check your credentials.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 login-container">
            <Card className="login-box shadow-lg border-0">
                <Card.Body className="p-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-1">FUNews</h2>
                        <p className="text-muted">Enter your credentials to access your account</p>
                    </div>

                    {formik.status && <Alert variant="danger" className="py-2 small">{formik.status}</Alert>}

                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                className={`py-2 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            ) : null}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className={`py-2 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            ) : null}
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 py-2 fw-bold btn-primary"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? (
                                <><Spinner size="sm" animation="border" className="me-2" /> Signing in...</>
                            ) : 'Sign In'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
