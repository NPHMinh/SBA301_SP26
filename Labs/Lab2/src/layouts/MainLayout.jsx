import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function MainLayout({ children, isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-vh-100 bg-light">
      <NavBar 
        currentPage={location.pathname}
        setCurrentPage={(page) => navigate(page)}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
      <main>
        {children}
      </main>
    </div>
  );
}