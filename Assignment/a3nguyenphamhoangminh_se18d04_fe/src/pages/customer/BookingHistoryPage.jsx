import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getMyBookingHistory } from '../../api/bookingAPI';

const BOOKING_STATUS = { 1: 'Active', 2: 'Checked-In', 3: 'Checked-Out', 0: 'Cancelled' };
const STATUS_COLOR = { 1: 'primary', 2: 'info', 3: 'success', 0: 'secondary' };

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getMyBookingHistory()
      .then((res) => {
        setBookings(res.data);
        if (res.data.length > 0) {
          toast.success(`✅ Tìm thấy ${res.data.length} đơn đặt phòng`);
        }
      })
      .catch((err) => {
        console.error('Load booking history error:', err);
        if (err.code === 'ERR_NETWORK') {
          toast.error('❌ Không thể kết nối đến server!');
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error('❌ Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        } else {
          toast.error('❌ Không thể tải lịch sử đặt phòng!');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">
          <i className="bi bi-clock-history text-primary me-2"></i>My Booking History
        </h2>
        <p className="text-muted">All your past and current reservations</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-calendar-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No bookings yet</h5>
          <p className="text-muted">Your booking history will appear here.</p>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div className="col-12" key={b.bookingReservationID}>
              <div className="card border-0 shadow-sm">
                <div
                  className="card-header bg-white d-flex justify-content-between align-items-center py-3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleExpand(b.bookingReservationID)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="bg-primary text-white rounded d-flex align-items-center justify-content-center"
                      style={{ width: '44px', height: '44px' }}
                    >
                      <i className="bi bi-journal-bookmark"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Reservation #{b.bookingReservationID}</h6>
                      <small className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>{b.bookingDate}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-success fw-bold fs-5">
                      ${Number(b.totalPrice || 0).toFixed(2)}
                    </span>
                    <span className={`badge bg-${STATUS_COLOR[b.bookingStatus]} fs-6`}>
                      {BOOKING_STATUS[b.bookingStatus] ?? 'Unknown'}
                    </span>
                    <i className={`bi bi-chevron-${expandedId === b.bookingReservationID ? 'up' : 'down'} text-muted`}></i>
                  </div>
                </div>

                {expandedId === b.bookingReservationID && b.bookingDetails?.length > 0 && (
                  <div className="card-body pt-0">
                    <hr className="mt-0" />
                    <h6 className="fw-bold mb-3">Rooms in this booking:</h6>
                    <div className="row g-3">
                      {b.bookingDetails.map((d, idx) => (
                        <div className="col-md-6 col-lg-4" key={idx}>
                          <div className="border rounded p-3 bg-light">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="fw-bold">Room {d.roomInformation?.roomNumber}</span>
                              <span className="badge bg-info text-dark">
                                {d.roomInformation?.roomType?.roomTypeName}
                              </span>
                            </div>
                            <p className="text-muted small mb-2">
                              <i className="bi bi-calendar-range me-1"></i>
                              {d.startDate} → {d.endDate}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <i className="bi bi-people me-1"></i>
                                {d.roomInformation?.roomMaxCapacity} guests max
                              </small>
                              <span className="text-success fw-semibold">
                                ${Number(d.actualPrice || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
