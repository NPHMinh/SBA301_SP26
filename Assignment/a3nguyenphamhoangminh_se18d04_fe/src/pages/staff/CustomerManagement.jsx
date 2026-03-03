import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../api/customerAPI';

const EMPTY_FORM = {
  customerFullName: '',
  telephone: '',
  emailAddress: '',
  customerBirthday: '',
  customerStatus: 1,
  password: '',
};

const STATUS_LABEL = { 1: 'Active', 0: 'Inactive' };
const STATUS_COLOR = { 1: 'success', 0: 'secondary' };

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllCustomers()
      .then((res) => {
        setCustomers(res.data);
        setFiltered(res.data);
        toast.success(`✅ Đã tải ${res.data.length} khách hàng`);
      })
      .catch((err) => {
        console.error('Load customers error:', err);
        toast.error('❌ Không thể tải danh sách khách hàng!');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(customers); return; }
    const s = search.toLowerCase();
    setFiltered(
      customers.filter(
        (c) =>
          c.customerFullName?.toLowerCase().includes(s) ||
          c.emailAddress?.toLowerCase().includes(s) ||
          c.telephone?.includes(s)
      )
    );
  }, [search, customers]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setForm({
      customerFullName: c.customerFullName || '',
      telephone: c.telephone || '',
      emailAddress: c.emailAddress || '',
      customerBirthday: c.customerBirthday || '',
      customerStatus: c.customerStatus ?? 1,
      password: '',
    });
    setErrors({});
    setEditId(c.customerID);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerFullName.trim()) e.customerFullName = 'Full name is required.';
    if (!form.telephone.trim()) e.telephone = 'Telephone is required.';
    else if (!/^[0-9]{9,11}$/.test(form.telephone)) e.telephone = 'Must be 9-11 digits.';
    if (!form.emailAddress.trim()) e.emailAddress = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress))
      e.emailAddress = 'Invalid email.';
    if (!form.customerBirthday) e.customerBirthday = 'Birthday is required.';
    if (!editId && !form.password) e.password = 'Password is required for new customer.';
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const val = validate();
    if (Object.keys(val).length > 0) {
      setErrors(val);
      toast.error('⚠️ Vui lòng kiểm tra lại thông tin!');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, customerStatus: Number(form.customerStatus) };
      if (!payload.password) delete payload.password;
      if (editId) {
        await updateCustomer(editId, payload);
        toast.success('✅ Cập nhật khách hàng thành công!');
      } else {
        await createCustomer(payload);
        toast.success('✅ Thêm khách hàng thành công!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error('Save customer error:', err);
      if (err.response?.status === 409 || err.response?.data?.includes('email')) {
        toast.error('❌ Email đã tồn tại!');
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        const msg = err.response?.data;
        toast.error(typeof msg === 'string' ? msg : '❌ Thao tác thất bại!');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const customer = customers.find(c => c.customerID === id);
    const customerName = customer?.customerFullName || 'this customer';
    
    if (!window.confirm(`Xóa khách hàng "${customerName}"?\n\nLưu ý: Không thể xóa nếu khách hàng đã có đặt phòng.`)) {
      return;
    }
    
    try {
      await deleteCustomer(id);
      toast.success(`✅ Đã xóa khách hàng "${customerName}"`);
      load();
    } catch (err) {
      console.error('Delete customer error:', err);
      if (err.response?.status === 409) {
        toast.error(`❌ Không thể xóa "${customerName}" vì đã có đặt phòng!`);
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        toast.error(`❌ Không thể xóa khách hàng "${customerName}"!`);
      }
    }
  };

  const Field = ({ name, label, type = 'text', required = false }) => (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        name={name}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        value={form[name]}
        onChange={handleChange}
      />
      {errors[name] && (
        <div className="invalid-feedback">
          <i className="bi bi-exclamation-circle me-1"></i>
          {errors[name]}
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-people text-primary me-2"></i>Customer Management
          </h2>
          <p className="text-muted mb-0">Manage all registered customers</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="bi bi-person-plus me-2"></i>Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-3 text-muted">Loading...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Telephone</th>
                    <th>Birthday</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c, idx) => (
                      <tr key={c.customerID}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="fw-semibold">{c.customerFullName}</td>
                        <td>{c.emailAddress}</td>
                        <td>{c.telephone}</td>
                        <td>{c.customerBirthday}</td>
                        <td>
                          <span className={`badge bg-${STATUS_COLOR[c.customerStatus]}`}>
                            {STATUS_LABEL[c.customerStatus] ?? 'Unknown'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => openEdit(c)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(c.customerID)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
                  {editId ? 'Edit Customer' : 'Add Customer'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <Field name="customerFullName" label="Full Name" required />
                      <Field name="emailAddress" label="Email" type="email" required />
                      <Field name="telephone" label="Telephone" required />
                    </div>
                    <div className="col-md-6">
                      <Field name="customerBirthday" label="Birthday" type="date" required />
                      <Field
                        name="password"
                        label={editId ? 'New Password (leave blank to keep)' : 'Password'}
                        type="password"
                        required={!editId}
                      />
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                          name="customerStatus"
                          className="form-select"
                          value={form.customerStatus}
                          onChange={handleChange}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    {editId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
