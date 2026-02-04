import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AccountManagement from './pages/admin/AccountManagement';
import CategoryManagement from './pages/staff/CategoryManagement';
import NewsManagement from './pages/staff/NewsManagement';
import UserProfile from './pages/staff/UserProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import './App.css';

// Component bảo vệ Route: Chỉ cho phép đúng Role truy cập
const PrivateRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();
    
    if (!user) return <Navigate to="/login" />;
    
    // Nếu allowedRole là array thì check xem role user có trong array không
    if (Array.isArray(allowedRole)) {
        if (!allowedRole.includes(user.accountRole)) return <Navigate to="/login" />;
    } else if (allowedRole && user.accountRole !== allowedRole) {
        // Nếu allowedRole là đơn lẻ thì check bình thường
        return <Navigate to="/login" />; 
    }
    
    return (
        <Layout>
            {children}
        </Layout>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/admin/accounts" element={
                        <PrivateRoute allowedRole={1}>
                            <AccountManagement />
                        </PrivateRoute>
                    } />

                    <Route path="/staff/categories" element={
                        <PrivateRoute allowedRole={2}>
                            <CategoryManagement />
                        </PrivateRoute>
                    } />
                    <Route path="/staff/news" element={
                        <PrivateRoute allowedRole={2}>
                            <NewsManagement />
                        </PrivateRoute>
                    } />
                    <Route path="/staff/profile" element={
                        <PrivateRoute allowedRole={[1, 2]}>
                            <UserProfile />
                        </PrivateRoute>
                    } />
                    
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </Router>
        </AuthProvider>
    );
}

export default App;