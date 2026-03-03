import { useEffect, useState } from 'react';
import { getAllRooms } from '../api/roomAPI';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_LABEL = { 1: 'Available', 0: 'Unavailable' };
const STATUS_COLOR = { 1: 'success', 0: 'secondary' };

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { isCustomer } = useAuth();

  useEffect(() => {
    getAllRooms()
      .then((res) => {
        setRooms(res.data);
        setFiltered(res.data);
        const availableRooms = res.data.filter(r => r.roomStatus === 1).length;
        toast.success(`✅ Tìm thấy ${res.data.length} phòng (${availableRooms} khả dụng)`);
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

  useEffect(() => {
    let result = rooms;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.roomNumber?.toLowerCase().includes(s) ||
          r.roomDetailDescription?.toLowerCase().includes(s) ||
          r.roomType?.roomTypeName?.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== '') {
      result = result.filter((r) => String(r.roomStatus) === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, rooms]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-door-open text-primary me-2"></i>Available Rooms
          </h2>
          <p className="text-muted mb-0">Browse all rooms in FU Mini Hotel</p>
        </div>
        {isCustomer && (
          <Link to="/customer/booking" className="btn btn-primary">
            <i className="bi bi-journal-plus me-2"></i>Book Now
          </Link>
        )}
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

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading rooms...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 text-muted">No rooms found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((room) => (
            <div className="col-md-6 col-lg-4" key={room.roomID}>
              <div className="card h-100 border-0 shadow-sm room-card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-door-closed me-2"></i>Room {room.roomNumber}
                  </h5>
                  <span className={`badge bg-${STATUS_COLOR[room.roomStatus]}`}>
                    {STATUS_LABEL[room.roomStatus] ?? 'Unknown'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <span className="badge bg-info text-dark">
                      <i className="bi bi-tag me-1"></i>
                      {room.roomType?.roomTypeName ?? 'N/A'}
                    </span>
                  </div>
                  <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>
                    {room.roomDetailDescription || 'No description available.'}
                  </p>
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <i className="bi bi-people text-primary d-block mb-1"></i>
                        <small className="fw-semibold">{room.roomMaxCapacity} guests</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <i className="bi bi-currency-dollar text-success d-block mb-1"></i>
                        <small className="fw-semibold text-success">
                          ${Number(room.roomPricePerDay).toFixed(0)}/day
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
