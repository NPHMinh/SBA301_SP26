import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authAPI';
import { toast } from 'react-toastify';

// Khai báo NGOÀI component để tránh bị tạo lại mỗi lần render → input mất focus
const Field = ({ name, label, type = 'text', placeholder, form, errors, onChange, onBlur }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold">
      {label} <span className="text-danger">*</span>
    </label>
    <input
      type={type}
      name={name}
      className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
      placeholder={placeholder}
      value={form[name]}
      onChange={onChange}
      onBlur={onBlur}
      autoComplete={name === 'emailAddress' ? 'email' : name === 'password' ? 'new-password' : name === 'confirmPassword' ? 'new-password' : 'off'}
    />
    {errors[name] && (
      <div className="invalid-feedback">
        <i className="bi bi-exclamation-circle me-1"></i>
        {errors[name]}
      </div>
    )}
  </div>
);

const INITIAL = {
  customerFullName: '',
  telephone: '',
  emailAddress: '',
  customerBirthday: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error khi user đang nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validate field khi blur
    const validationErrors = validate();
    if (validationErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.customerFullName.trim()) {
      newErrors.customerFullName = 'Họ tên không được để trống';
    } else if (form.customerFullName.trim().length < 3) {
      newErrors.customerFullName = 'Họ tên phải có ít nhất 3 ký tự';
    }
    
    if (!form.telephone.trim()) {
      newErrors.telephone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{9,11}$/.test(form.telephone)) {
      newErrors.telephone = 'Số điện thoại phải có 9-11 chữ số';
    }
    
    if (!form.emailAddress.trim()) {
      newErrors.emailAddress = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) {
      newErrors.emailAddress = 'Email không đúng định dạng';
    }
    
    if (!form.customerBirthday) {
      newErrors.customerBirthday = 'Ngày sinh không được để trống';
    } else {
      const age = Math.floor((new Date() - new Date(form.customerBirthday)) / 31557600000);
      if (age < 18) {
        newErrors.customerBirthday = 'Bạn phải từ 18 tuổi trở lên';
      } else if (age > 120) {
        newErrors.customerBirthday = 'Ngày sinh không hợp lệ';
      }
    }
    
    if (!form.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('⚠️ Vui lòng kiểm tra lại thông tin!');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register({ ...payload, customerStatus: 1 });
      toast.success('✅ Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.status === 409 || err.response?.data?.includes('email')) {
        toast.error('❌ Email đã được sử dụng!');
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        const msg = err.response?.data;
        toast.error(typeof msg === 'string' ? msg : '❌ Đăng ký thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
      <div className="card shadow-lg border-0" style={{ width: '480px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-person-plus text-primary" style={{ fontSize: '2.5rem' }}></i>
            <h3 className="fw-bold text-primary mt-2">Create Account</h3>
            <p className="text-muted">Register as a hotel customer</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Field name="customerFullName" label="Full Name" placeholder="Nguyen Van A" form={form} errors={errors} onChange={handleChange} onBlur={handleBlur} />
            <Field name="emailAddress" label="Email Address" type="email" placeholder="you@example.com" form={form} errors={errors} onChange={handleChange} onBlur={handleBlur} />
            <Field name="telephone" label="Telephone" placeholder="0901234567" form={form} errors={errors} onChange={handleChange} onBlur={handleBlur} />
            <Field name="customerBirthday" label="Date of Birth" type="date" form={form} errors={errors} onChange={handleChange} onBlur={handleBlur} />
            <Field name="password" label="Password" type="password" placeholder="••••••••" form={form} errors={errors} onChange={handleChange} onBlur={handleBlur} />
            <Field name="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" form={form} errors={errors} onChange={handleChange} onBlur={handleBlur} />

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Registering...
                </>
              ) : (
                <>
                  <i className="bi bi-person-check me-2"></i>Register
                </>
              )}
            </button>
          </form>

          <hr className="my-4" />
          <p className="text-center text-muted mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
