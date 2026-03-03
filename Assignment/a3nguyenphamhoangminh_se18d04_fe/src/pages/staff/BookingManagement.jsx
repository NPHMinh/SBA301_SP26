import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllBookings, updateBookingStatus, createBooking } from '../../api/bookingAPI';
import { getAllCustomers } from '../../api/customerAPI';
import { getAllRooms } from '../../api/roomAPI';

const BOOKING_STATUS = { 1: 'Active', 2: 'Checked-In', 3: 'Checked-Out', 0: 'Cancelled' };
const STATUS_COLOR = { 1: 'primary', 2: 'info', 3: 'success', 0: 'secondary' };

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailBooking, setDetailBooking] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    customerId: '',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingStatus: 1,
    rooms: [{ roomId: '', startDate: '', endDate: '' }],
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllBookings()
      .then((res) => {
        setBookings(res.data);
        setFiltered(res.data);
        toast.success(`✅ Đã tải ${res.data.length} đơn đặt phòng`);
      })
      .catch((err) => {
        console.error('Load bookings error:', err);
        toast.error('❌ Không thể tải danh sách đặt phòng!');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    Promise.all([getAllCustomers(), getAllRooms()]).then(([c, r]) => {
      setCustomers(c.data);
      setRooms(r.data.filter((room) => room.roomStatus === 1));
    });
  }, []);

  useEffect(() => {
    let res = bookings;
    if (search) {
      const s = search.toLowerCase();
      res = res.filter(
        (b) =>
          b.customer?.customerFullName?.toLowerCase().includes(s) ||
          String(b.bookingReservationID).includes(s)
      );
    }
    if (statusFilter !== '') {
      res = res.filter((b) => String(b.bookingStatus) === statusFilter);
    }
    setFiltered(res);
  }, [search, statusFilter, bookings]);

  const handleStatusChange = async (id, newStatus) => {
    const statusName = BOOKING_STATUS[newStatus] || 'Unknown';
    try {
      await updateBookingStatus(id, newStatus);
      toast.success(`✅ Đã cập nhật trạng thái thành: ${statusName}`);
      load();
    } catch (err) {
      console.error('Update status error:', err);
      if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        toast.error('❌ Cập nhật trạng thái thất bại!');
      }
    }
  };

  const addRoomRow = () =>
    setForm((prev) => ({
      ...prev,
      rooms: [...prev.rooms, { roomId: '', startDate: '', endDate: '' }],
    }));

  const removeRoomRow = (idx) =>
    setForm((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== idx),
    }));

  const updateRoomRow = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.rooms];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, rooms: updated };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.customerId) {
      toast.warning('⚠️ Vui lòng chọn khách hàng!');
      return;
    }
    
    if (form.rooms.length === 0) {
      toast.warning('⚠️ Vui lòng thêm ít nhất một phòng!');
      return;
    }
    
    if (form.rooms.some((r) => !r.roomId || !r.startDate || !r.endDate)) {
      toast.warning('⚠️ Vui lòng điền đầy đủ thông tin phòng!');
      return;
    }
    
    // Validate dates
    for (const r of form.rooms) {
      if (new Date(r.endDate) <= new Date(r.startDate)) {
        toast.error('❌ Ngày kết thúc phải sau ngày bắt đầu!');
        return;
      }
    }
    
    setSaving(true);
    try {
      const payload = {
        customerID: Number(form.customerId),
        bookingDate: form.bookingDate,
        bookingStatus: Number(form.bookingStatus),
        bookingDetails: form.rooms.map((r) => ({
          roomID: Number(r.roomId),
          startDate: r.startDate,
          endDate: r.endDate,
        })),
      };
      await createBooking(payload);
      toast.success('✅ Tạo đơn đặt phòng thành công!');
      setShowCreateModal(false);
      load();
    } catch (err) {
      console.error('Create booking error:', err);
      if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        const msg = err.response?.data;
        toast.error(typeof msg === 'string' ? msg : '❌ Tạo đơn đặt phòng thất bại!');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-calendar-check text-primary me-2"></i>Booking Management
          </h2>
          <p className="text-muted mb-0">View and manage all hotel reservations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>New Booking
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
                  placeholder="Search by booking ID or customer name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                {Object.entries(BOOKING_STATUS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Booking Date</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">No bookings found.</td>
                    </tr>
                  ) : (
                    filtered.map((b) => (
                      <tr key={b.bookingReservationID}>
                        <td className="fw-bold">#{b.bookingReservationID}</td>
                        <td>{b.customer?.customerFullName || '—'}</td>
                        <td>{b.bookingDate}</td>
                        <td className="text-success fw-semibold">
                          ${Number(b.totalPrice || 0).toFixed(2)}
                        </td>
                        <td>
                          <span className={`badge bg-${STATUS_COLOR[b.bookingStatus]}`}>
                            {BOOKING_STATUS[b.bookingStatus] ?? 'Unknown'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-info me-1"
                            onClick={() => setDetailBooking(b)}
                            title="View details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <select
                            className="form-select form-select-sm d-inline-block w-auto ms-1"
                            value={b.bookingStatus}
                            onChange={(e) =>
                              handleStatusChange(b.bookingReservationID, Number(e.target.value))
                            }
                          >
                            {Object.entries(BOOKING_STATUS).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
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

      {/* Detail Modal */}
      {detailBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Booking #{detailBooking.bookingReservationID} — Details
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDetailBooking(null)} />
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Customer:</strong> {detailBooking.customer?.customerFullName}</p>
                    <p className="mb-1"><strong>Email:</strong> {detailBooking.customer?.emailAddress}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Booking Date:</strong> {detailBooking.bookingDate}</p>
                    <p className="mb-1">
                      <strong>Status:</strong>{' '}
                      <span className={`badge bg-${STATUS_COLOR[detailBooking.bookingStatus]}`}>
                        {BOOKING_STATUS[detailBooking.bookingStatus]}
                      </span>
                    </p>
                    <p className="mb-1">
                      <strong>Total:</strong>{' '}
                      <span className="text-success fw-bold">
                        ${Number(detailBooking.totalPrice || 0).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
                {detailBooking.bookingDetails?.length > 0 && (
                  <>
                    <h6 className="fw-bold mb-2">Rooms Booked:</h6>
                    <table className="table table-bordered table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Room</th>
                          <th>Type</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailBooking.bookingDetails.map((d, i) => (
                          <tr key={i}>
                            <td>{d.roomInformation?.roomNumber}</td>
                            <td>{d.roomInformation?.roomType?.roomTypeName}</td>
                            <td>{d.startDate}</td>
                            <td>{d.endDate}</td>
                            <td className="text-success">${Number(d.actualPrice || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDetailBooking(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>New Booking
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)} />
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Customer <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={form.customerId}
                        onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))}
                      >
                        <option value="">-- Select Customer --</option>
                        {customers.map((c) => (
                          <option key={c.customerID} value={c.customerID}>
                            {c.customerFullName} ({c.emailAddress})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Booking Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.bookingDate}
                        onChange={(e) => setForm((p) => ({ ...p, bookingDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">Rooms</h6>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={addRoomRow}>
                      <i className="bi bi-plus me-1"></i>Add Room
                    </button>
                  </div>

                  {form.rooms.map((row, idx) => (
                    <div key={idx} className="border rounded p-3 mb-3 bg-light">
                      <div className="row g-2 align-items-end">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold small">Room</label>
                          <select
                            className="form-select form-select-sm"
                            value={row.roomId}
                            onChange={(e) => updateRoomRow(idx, 'roomId', e.target.value)}
                          >
                            <option value="">-- Select --</option>
                            {rooms.map((r) => (
                              <option key={r.roomID} value={r.roomID}>
                                {r.roomNumber} — ${Number(r.roomPricePerDay).toFixed(0)}/day
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold small">Start Date</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={row.startDate}
                            onChange={(e) => updateRoomRow(idx, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold small">End Date</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={row.endDate}
                            onChange={(e) => updateRoomRow(idx, 'endDate', e.target.value)}
                          />
                        </div>
                        <div className="col-md-2">
                          {form.rooms.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger w-100"
                              onClick={() => removeRoomRow(idx)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Create Booking
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
