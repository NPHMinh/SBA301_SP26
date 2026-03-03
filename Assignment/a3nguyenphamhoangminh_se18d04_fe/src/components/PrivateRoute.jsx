import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';

/**
 * Protects routes by role.
 * @param {string} requiredRole - 'ROLE_STAFF' | 'ROLE_CUSTOMER' | undefined (any logged in user)
 */
export default function PrivateRoute({ children, requiredRole }) {
  const { isLoggedIn, role } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !hasShownToast.current) {
      toast.warning('⚠️ Vui lòng đăng nhập để truy cập trang này!');
      hasShownToast.current = true;
    } else if (isLoggedIn && requiredRole && role !== requiredRole && !hasShownToast.current) {
      if (requiredRole === 'ROLE_STAFF') {
        toast.error('❌ Bạn không có quyền truy cập trang quản lý!');
      } else {
        toast.error('❌ Bạn không có quyền truy cập trang này!');
      }
      hasShownToast.current = true;
    }
  }, [isLoggedIn, role, requiredRole]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
