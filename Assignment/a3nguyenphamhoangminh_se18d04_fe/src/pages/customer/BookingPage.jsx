import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllRooms } from '../../api/roomAPI';
import { createBooking } from '../../api/bookingAPI';
import { useAuth } from '../../context/AuthContext';

export default function BookingPage() {
  const { customerId } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [dates, setDates] = useState({});
  const [bookingDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    getAllRooms()
      .then((res) => {
        const availableRooms = res.data.filter((r) => r.roomStatus === 1);
        setRooms(availableRooms);
        toast.success(`✅ Có ${availableRooms.length} phòng khả dụng`);
      })
      .catch((err) => {
        console.error('Load rooms error:', err);
        if (err.code === 'ERR_NETWORK') {
          toast.error('❌ Không thể kết nối đến server!');
        } else {
          toast.error('❌ Không thể tải danh sách phòng!');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleRoom = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
    if (!dates[roomId]) {
      setDates((prev) => ({ ...prev, [roomId]: { startDate: '', endDate: '' } }));
    }
  };

  const updateDate = (roomId, field, value) => {
    setDates((prev) => ({ ...prev, [roomId]: { ...prev[roomId], [field]: value } }));
  };

  const calcNights = (roomId) => {
    const d = dates[roomId];
    if (!d?.startDate || !d?.endDate) return 0;
    const diff = new Date(d.endDate) - new Date(d.startDate);
    return Math.max(0, Math.floor(diff / 86400000));
  };

  const calcTotal = () =>
    selectedRooms.reduce((sum, roomId) => {
      const room = rooms.find((r) => r.roomID === roomId);
      if (!room) return sum;
      return sum + Number(room.roomPricePerDay) * calcNights(roomId);
    }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (selectedRooms.length === 0) {
      toast.warning('⚠️ Vui lòng chọn ít nhất một phòng!');
      return;
    }
    
    for (const roomId of selectedRooms) {
      const d = dates[roomId] || {};
      const room = rooms.find(r => r.roomID === roomId);
      const roomNum = room?.roomNumber || roomId;
      
      if (!d.startDate || !d.endDate) {
        toast.warning(`⚠️ Vui lòng chọn ngày cho phòng ${roomNum}!`);
        return;
      }
      
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        toast.error(`❌ Ngày bắt đầu của phòng ${roomNum} không thể là ngày trong quá khứ!`);
        return;
      }
      
      if (end <= start) {
        toast.error(`❌ Ngày kết thúc của phòng ${roomNum} phải sau ngày bắt đầu!`);
        return;
      }
      
      const nights = calcNights(roomId);
      if (nights > 30) {
        toast.warning(`⚠️ Phòng ${roomNum}: Không thể đặt quá 30 ngày!`);
        return;
      }
    }
    
    setSaving(true);
    try {
      const payload = {
        customerID: Number(customerId),
        bookingDate,
        bookingStatus: 1,
        bookingDetails: selectedRooms.map((roomId) => ({
          roomID: roomId,
          startDate: dates[roomId].startDate,
          endDate: dates[roomId].endDate,
        })),
      };
      await createBooking(payload);
      toast.success('✅ Đặt phòng thành công!');
      navigate('/customer/history');
    } catch (err) {
      console.error('Booking error:', err);
      if (err.response?.data?.includes('NULL')) {
        toast.error('❌ Lỗi hệ thống! Vui lòng thử lại sau.');
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('❌ Không thể kết nối đến server!');
      } else {
        const msg = err.response?.data;
        toast.error(typeof msg === 'string' ? msg : '❌ Đặt phòng thất bại!');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Loading available rooms...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="fw-bold">
            <i className="bi bi-journal-plus text-primary me-2"></i>Book a Room
          </h2>
          <p className="text-muted">Select one or more rooms and choose your dates</p>
        </div>

        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {rooms.map((room) => {
                const isSelected = selectedRooms.includes(room.roomID);
                const nights = calcNights(room.roomID);
                return (
                  <div className="col-md-6" key={room.roomID}>
                    <div
                      className={`card border-2 h-100 cursor-pointer booking-room-card ${
                        isSelected ? 'border-primary shadow' : 'border-light shadow-sm'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleRoom(room.roomID)}
                    >
                      <div className={`card-header ${isSelected ? 'bg-primary text-white' : 'bg-light'}`}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">Room {room.roomNumber}</span>
                          <div className="form-check mb-0">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isSelected}
                              onChange={() => toggleRoom(room.roomID)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ width: '1.2rem', height: '1.2rem' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <span className="badge bg-info text-dark mb-2">
                          {room.roomType?.roomTypeName}
                        </span>
                        <p className="text-muted small mb-2">{room.roomDetailDescription || '—'}</p>
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">
                            <i className="bi bi-people me-1"></i>{room.roomMaxCapacity} guests
                          </small>
                          <small className="text-success fw-bold">
                            ${Number(room.roomPricePerDay).toFixed(0)}/night
                          </small>
                        </div>

                        {isSelected && (
                          <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                            <hr className="my-2" />
                            <div className="mb-2">
                              <label className="form-label fw-semibold small">Check-in Date</label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                value={dates[room.roomID]?.startDate || ''}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => updateDate(room.roomID, 'startDate', e.target.value)}
                              />
                            </div>
                            <div className="mb-2">
                              <label className="form-label fw-semibold small">Check-out Date</label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                value={dates[room.roomID]?.endDate || ''}
                                min={dates[room.roomID]?.startDate || new Date().toISOString().split('T')[0]}
                                onChange={(e) => updateDate(room.roomID, 'endDate', e.target.value)}
                              />
                            </div>
                            {nights > 0 && (
                              <div className="alert alert-info py-1 px-2 mb-0 small">
                                <i className="bi bi-moon me-1"></i>
                                {nights} night{nights > 1 ? 's' : ''} ×{' '}
                                ${Number(room.roomPricePerDay).toFixed(0)} ={' '}
                                <strong>${(nights * Number(room.roomPricePerDay)).toFixed(2)}</strong>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {rooms.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 text-muted">No available rooms at the moment.</p>
              </div>
            )}

            {selectedRooms.length > 0 && (
              <div className="card border-0 shadow mt-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Booking Summary</h5>
                    <span className="badge bg-primary">{selectedRooms.length} room(s)</span>
                  </div>
                  <table className="table table-sm mb-3">
                    <tbody>
                      {selectedRooms.map((roomId) => {
                        const room = rooms.find((r) => r.roomID === roomId);
                        const n = calcNights(roomId);
                        return (
                          <tr key={roomId}>
                            <td>Room {room?.roomNumber}</td>
                            <td>{n > 0 ? `${n} night(s)` : '—'}</td>
                            <td className="text-end text-success fw-semibold">
                              {n > 0 ? `$${(n * Number(room?.roomPricePerDay)).toFixed(2)}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan="2" className="fw-bold">Estimated Total</td>
                        <td className="text-end fw-bold text-success fs-5">${calcTotal().toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold"
                    disabled={saving}
                  >
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                    ) : (
                      <><i className="bi bi-check-circle me-2"></i>Confirm Booking</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light fw-semibold">
              <i className="bi bi-info-circle me-2 text-primary"></i>Booking Info
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-2 d-flex">
                  <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                  <span>Select one or more rooms by clicking on them.</span>
                </li>
                <li className="mb-2 d-flex">
                  <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                  <span>Set check-in and check-out dates for each selected room.</span>
                </li>
                <li className="mb-2 d-flex">
                  <i className="bi bi-check-circle text-success me-2 mt-1 flex-shrink-0"></i>
                  <span>Review the summary and confirm your booking.</span>
                </li>
                <li className="d-flex">
                  <i className="bi bi-info-circle text-info me-2 mt-1 flex-shrink-0"></i>
                  <span>You can view your booking history after confirming.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
