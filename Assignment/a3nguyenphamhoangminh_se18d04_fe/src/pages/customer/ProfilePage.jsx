import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../api/customerAPI';

export default function ProfilePage() {
  const { customerId } = useAuth();
  const [form, setForm] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    customerStatus: 1,
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const c = res.data;
        setForm({
          customerFullName: c.customerFullName || '',
          telephone: c.telephone || '',
          emailAddress: c.emailAddress || '',
          customerBirthday: c.customerBirthday || '',
          customerStatus: c.customerStatus ?? 1,
          password: '',
        });
        toast.success('✅ Đã tải thông tin cá nhân');
      } catch (err) {
        console.error('Load profile error:', err);
        if (err.code === 'ERR_NETWORK') {
          toast.error('❌ Không thể kết nối đến server!');
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error('❌ Phiên đăng nhập hết hạn!');
        } else {
          toast.error('❌ Không thể tải thông tin cá nhân!');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerFullName.trim()) {
      e.customerFullName = 'Họ tên không được để trống';
    } else if (form.customerFullName.trim().length < 3) {
      e.customerFullName = 'Họ tên phải có ít nhất 3 ký tự';
    }
    
    if (!form.telephone.trim()) {
      e.telephone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{9,11}$/.test(form.telephone)) {
      e.telephone = 'Số điện thoại phải có 9-11 chữ số';
    }
    
    if (!form.emailAddress.trim()) {
      e.emailAddress = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) {
      e.emailAddress = 'Email không đúng định dạng';
    }
    
    if (form.password && form.password.length < 6) {
      e.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = validate();
    if (Object.keys(val).length > 0) {
      setErrors(val);
      toast.error('⚠️ Vui lòng kiểm tra lại thông tin!');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await updateMyProfile(payload);
      toast.success('✅ Cập nhật thông tin thành công!');
      if (!payload.password) {
        toast.info('💡 Để thay đổi mật khẩu, vui lòng nhập mật khẩu mới.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        toast.error('❌ Cập nhật thông tin thất bại!');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  const Field = ({ name, label, type = 'text' }) => (
    <div className="mb-4">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        name={name}
        className={`form-control form-control-lg ${errors[name] ? 'is-invalid' : ''}`}
        value={form[name]}
        onChange={handleChange}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow">
            <div className="card-header bg-primary text-white py-4">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: '56px', height: '56px' }}
                >
                  <i className="bi bi-person-fill text-primary" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">{form.customerFullName || 'My Profile'}</h4>
                  <small className="opacity-75">{form.emailAddress}</small>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <Field name="customerFullName" label="Full Name" />
                <Field name="emailAddress" label="Email Address" type="email" />
                <Field name="telephone" label="Telephone" />
                <Field name="customerBirthday" label="Date of Birth" type="date" />
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    New Password{' '}
                    <span className="text-muted fw-normal">(leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-semibold"
                  disabled={saving}
                >
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                  ) : (
                    <><i className="bi bi-check-circle me-2"></i>Save Changes</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

