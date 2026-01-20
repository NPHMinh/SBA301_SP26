import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/AuthContext';
import { OrchidProvider } from './contexts/OrchidContext';
import { UserProvider } from './contexts/UserContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import OrchidsList from './pages/OrchidsList';
import OrchidDetail from './pages/OrchidDetail';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <AuthProvider>
          <OrchidProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/orchids" 
                  element={
                    <ProtectedRoute>
                      <OrchidsList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orchid/:id" 
                  element={
                    <ProtectedRoute>
                      <OrchidDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute>
                      <UserManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
          </OrchidProvider>
        </AuthProvider>
      </UserProvider>
    </Router>
  );
}
