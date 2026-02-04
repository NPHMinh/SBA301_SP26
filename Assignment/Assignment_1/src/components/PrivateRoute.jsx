import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRole }) => {
    // Lấy user từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Nếu chưa đăng nhập -> Về trang Login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 2. Nếu có yêu cầu Role mà Role user không khớp -> Về Login (hoặc trang 403)
    if (allowedRole && user.accountRole !== allowedRole) {
        return <Navigate to="/login" />;
    }

    // 3. Hợp lệ -> Render Component con
    return children;
};

export default PrivateRoute;