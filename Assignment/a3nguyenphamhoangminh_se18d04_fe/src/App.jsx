import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomsPage from './pages/RoomsPage';

import CustomerManagement from './pages/staff/CustomerManagement';
import RoomManagement from './pages/staff/RoomManagement';
import BookingManagement from './pages/staff/BookingManagement';

import ProfilePage from './pages/customer/ProfilePage';
import BookingPage from './pages/customer/BookingPage';
import BookingHistoryPage from './pages/customer/BookingHistoryPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-vh-100 d-flex flex-column bg-body-secondary">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/rooms" replace />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Staff */}
              <Route
                path="/staff/customers"
                element={
                  <PrivateRoute requiredRole="ROLE_STAFF">
                    <CustomerManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff/rooms"
                element={
                  <PrivateRoute requiredRole="ROLE_STAFF">
                    <RoomManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff/bookings"
                element={
                  <PrivateRoute requiredRole="ROLE_STAFF">
                    <BookingManagement />
                  </PrivateRoute>
                }
              />

              {/* Customer */}
              <Route
                path="/customer/profile"
                element={
                  <PrivateRoute requiredRole="ROLE_CUSTOMER">
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/booking"
                element={
                  <PrivateRoute requiredRole="ROLE_CUSTOMER">
                    <BookingPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/history"
                element={
                  <PrivateRoute requiredRole="ROLE_CUSTOMER">
                    <BookingHistoryPage />
                  </PrivateRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/rooms" replace />} />
            </Routes>
          </main>

          <footer className="bg-primary text-white text-center py-3 mt-auto">
            <small>© 2025 FU Mini Hotel System — All rights reserved</small>
          </footer>
        </div>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
      />
    </AuthProvider>
  );
}
