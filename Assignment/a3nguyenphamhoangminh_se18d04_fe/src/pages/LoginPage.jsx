import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email không được để trống';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Email không đúng định dạng (ví dụ: user@example.com)';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        error = 'Mật khẩu không được để trống';
      } else if (value.length < 6) {
        error = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Validate real-time nếu đã touch
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
    // Validate all fields
    const emailError = validateField('email', form.email);
    const passwordError = validateField('password', form.password);
    
    setErrors({ email: emailError, password: passwordError });
    
    if (emailError || passwordError) {
      toast.error('⚠️ Vui lòng kiểm tra lại thông tin!');
      return;
    }
    
    setLoading(true);
    try {
      const role = await login(form.email, form.password);
      toast.success('✅ Đăng nhập thành công!');
      if (role === 'ROLE_STAFF') {
        navigate('/staff/customers');
      } else {
        navigate('/rooms');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setErrors({ email: 'Email hoặc mật khẩu không chính xác', password: 'Email hoặc mật khẩu không chính xác' });
        toast.error('❌ Email hoặc mật khẩu không chính xác!');
      } else if (err.response?.status === 403) {
        setErrors({ email: 'Tài khoản đã bị khóa', password: '' });
        toast.error('❌ Tài khoản của bạn đã bị khóa!');
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        const msg = err.response?.data;
        toast.error(typeof msg === 'string' ? msg : '❌ Đăng nhập thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ width: '420px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="auth-icon mb-3">
              <i className="bi bi-building text-primary" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="fw-bold text-primary">FU Mini Hotel</h3>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className={`input-group-text ${errors.email && touched.email ? 'border-danger' : 'bg-light'}`}>
                  <i className={`bi bi-envelope ${errors.email && touched.email ? 'text-danger' : 'text-primary'}`}></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
              </div>
              {errors.email && touched.email && (
                <div className="invalid-feedback d-block">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className={`input-group-text ${errors.password && touched.password ? 'border-danger' : 'bg-light'}`}>
                  <i className={`bi bi-lock ${errors.password && touched.password ? 'text-danger' : 'text-primary'}`}></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && touched.password && (
                <div className="invalid-feedback d-block">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                </>
              )}
            </button>
          </form>

          <hr className="my-4" />
          <p className="text-center text-muted mb-0">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
