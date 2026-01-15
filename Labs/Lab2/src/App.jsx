import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import OrchidsList from './pages/OrchidsList';
import OrchidDetail from './pages/OrchidDetail';
import Footer from './components/Footer';

export default function App() {
  // Đọc trạng thái login từ localStorage khi khởi động
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  // Lưu trạng thái login vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/orchids" /> : <Login onLogin={handleLogin} />
          } />
          <Route 
            path="/orchids" 
            element={isLoggedIn ? <OrchidsList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/orchid/:id" 
            element={isLoggedIn ? <OrchidDetail /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer avatar="/images/DocterMinh.jpg" authorName="MinhNPH" authorEmail="minhnphde180174@fpt.edu.vn"/>
      </MainLayout>
    </Router>
  );
}