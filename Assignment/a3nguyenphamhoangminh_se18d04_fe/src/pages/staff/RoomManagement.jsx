import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRoomTypes,
} from '../../api/roomAPI';

const EMPTY_FORM = {
  roomNumber: '',
  roomDetailDescription: '',
  roomMaxCapacity: '',
  roomStatus: 1,
  roomPricePerDay: '',
  roomTypeID: '',
};

const STATUS_LABEL = { 1: 'Available', 0: 'Unavailable' };
const STATUS_COLOR = { 1: 'success', 0: 'secondary' };

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getAllRooms(), getAllRoomTypes()])
      .then(([roomsRes, typesRes]) => {
        setRooms(roomsRes.data);
        setFilteredFromList(roomsRes.data, search, statusFilter);
        setRoomTypes(typesRes.data);
        toast.success(`✅ Đã tải ${roomsRes.data.length} phòng`);
      })
      .catch((err) => {
        console.error('Load rooms error:', err);
        toast.error('❌ Không thể tải danh sách phòng!');
      })
      .finally(() => setLoading(false));
  };

  const setFilteredFromList = (list, s, sf) => {
    let res = list;
    if (s) {
      const q = s.toLowerCase();
      res = res.filter(
        (r) =>
          r.roomNumber?.toLowerCase().includes(q) ||
          r.roomDetailDescription?.toLowerCase().includes(q) ||
          r.roomType?.roomTypeName?.toLowerCase().includes(q)
      );
    }
    if (sf !== '') res = res.filter((r) => String(r.roomStatus) === sf);
    setFiltered(res);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    setFilteredFromList(rooms, search, statusFilter);
  }, [search, statusFilter, rooms]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setForm({
      roomNumber: r.roomNumber || '',
      roomDetailDescription: r.roomDetailDescription || '',
      roomMaxCapacity: r.roomMaxCapacity || '',
      roomStatus: r.roomStatus ?? 1,
      roomPricePerDay: r.roomPricePerDay || '',
      roomTypeID: r.roomType?.roomTypeID || '',
    });
    setErrors({});
    setEditId(r.roomID);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.roomNumber.trim()) e.roomNumber = 'Room number is required.';
    if (!form.roomMaxCapacity || Number(form.roomMaxCapacity) < 1)
      e.roomMaxCapacity = 'Max capacity must be >= 1.';
    if (!form.roomPricePerDay || Number(form.roomPricePerDay) <= 0)
      e.roomPricePerDay = 'Price must be > 0.';
    if (!form.roomTypeID) e.roomTypeID = 'Room type is required.';
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
      const payload = {
        roomNumber: form.roomNumber,
        roomDetailDescription: form.roomDetailDescription,
        roomMaxCapacity: Number(form.roomMaxCapacity),
        roomStatus: Number(form.roomStatus),
        roomPricePerDay: Number(form.roomPricePerDay),
        roomType: { roomTypeID: Number(form.roomTypeID) },
      };
      if (editId) {
        await updateRoom(editId, payload);
        toast.success(`✅ Cập nhật phòng ${form.roomNumber} thành công!`);
      } else {
        await createRoom(payload);
        toast.success(`✅ Thêm phòng ${form.roomNumber} thành công!`);
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error('Save room error:', err);
      if (err.response?.data?.includes('duplicate') || err.response?.data?.includes('unique')) {
        toast.error(`❌ Số phòng ${form.roomNumber} đã tồn tại!`);
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
    const room = rooms.find(r => r.roomID === id);
    const roomNum = room?.roomNumber || id;
    
    if (
      !window.confirm(
        `Xóa phòng ${roomNum}?\n\n• Nếu chưa từng được đặt → xóa vĩnh viễn\n• Nếu đã có đặt phòng → chuyển trạng thái Không khả dụng`
      )
    ) return;
    
    try {
      await deleteRoom(id);
      toast.success(`✅ Đã xóa / vô hiệu hóa phòng ${roomNum}`);
      load();
    } catch (err) {
      console.error('Delete room error:', err);
      if (err.response?.status === 409) {
        toast.error(`❌ Không thể xóa phòng ${roomNum} vì đang có đặt phòng!`);
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        toast.error(`❌ Không thể xóa phòng ${roomNum}!`);
      }
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-building-gear text-primary me-2"></i>Room Management
          </h2>
          <p className="text-muted mb-0">Add, update and remove hotel rooms</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i>Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by room number, description or type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="1">Available</option>
                <option value="0">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Room No.</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Capacity</th>
                    <th>Price/Day</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">No rooms found.</td>
                    </tr>
                  ) : (
                    filtered.map((r, idx) => (
                      <tr key={r.roomID}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="fw-semibold">{r.roomNumber}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {r.roomType?.roomTypeName ?? 'N/A'}
                          </span>
                        </td>
                        <td className="text-muted small" style={{ maxWidth: '200px' }}>
                          {r.roomDetailDescription || '—'}
                        </td>
                        <td>
                          <i className="bi bi-people me-1 text-muted"></i>{r.roomMaxCapacity}
                        </td>
                        <td className="text-success fw-semibold">
                          ${Number(r.roomPricePerDay).toFixed(0)}
                        </td>
                        <td>
                          <span className={`badge bg-${STATUS_COLOR[r.roomStatus]}`}>
                            {STATUS_LABEL[r.roomStatus] ?? 'Unknown'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => openEdit(r)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(r.roomID)}
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
                  <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                  {editId ? 'Edit Room' : 'Add Room'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Room Number <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          name="roomNumber"
                          className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
                          value={form.roomNumber}
                          onChange={handleChange}
                          placeholder="e.g., 101, 201A"
                        />
                        {errors.roomNumber && (
                          <div className="invalid-feedback">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.roomNumber}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Room Type <span className="text-danger">*</span></label>
                        <select
                          name="roomTypeID"
                          className={`form-select ${errors.roomTypeID ? 'is-invalid' : ''}`}
                          value={form.roomTypeID}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Type --</option>
                          {roomTypes.map((t) => (
                            <option key={t.roomTypeID} value={t.roomTypeID}>
                              {t.roomTypeName}
                            </option>
                          ))}
                        </select>
                        {errors.roomTypeID && (
                          <div className="invalid-feedback">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.roomTypeID}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Max Capacity <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          name="roomMaxCapacity"
                          min="1"
                          className={`form-control ${errors.roomMaxCapacity ? 'is-invalid' : ''}`}
                          value={form.roomMaxCapacity}
                          onChange={handleChange}
                          placeholder="Number of guests"
                        />
                        {errors.roomMaxCapacity && (
                          <div className="invalid-feedback">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.roomMaxCapacity}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Price Per Day ($) <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          name="roomPricePerDay"
                          min="0"
                          step="0.01"
                          className={`form-control ${errors.roomPricePerDay ? 'is-invalid' : ''}`}
                          value={form.roomPricePerDay}
                          onChange={handleChange}
                          placeholder="Enter price"
                        />
                        {errors.roomPricePerDay && (
                          <div className="invalid-feedback">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.roomPricePerDay}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                          name="roomStatus"
                          className="form-select"
                          value={form.roomStatus}
                          onChange={handleChange}
                        >
                          <option value={1}>Available</option>
                          <option value={0}>Unavailable</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                          name="roomDetailDescription"
                          className="form-control"
                          rows="3"
                          value={form.roomDetailDescription}
                          onChange={handleChange}
                        />
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
