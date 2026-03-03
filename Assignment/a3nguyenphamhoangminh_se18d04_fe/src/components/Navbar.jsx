import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, isStaff, isCustomer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-building me-2"></i>FU Mini Hotel
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/rooms">
                <i className="bi bi-door-open me-1"></i>Rooms
              </Link>
            </li>

            {isStaff && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/staff/customers">
                    <i className="bi bi-people me-1"></i>Customers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/staff/rooms">
                    <i className="bi bi-building-gear me-1"></i>Manage Rooms
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/staff/bookings">
                    <i className="bi bi-calendar-check me-1"></i>Bookings
                  </Link>
                </li>
              </>
            )}

            {isCustomer && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/booking">
                    <i className="bi bi-journal-plus me-1"></i>Book a Room
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/history">
                    <i className="bi bi-clock-history me-1"></i>My Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/profile">
                    <i className="bi bi-person-circle me-1"></i>Profile
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
