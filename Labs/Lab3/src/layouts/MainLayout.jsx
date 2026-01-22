import React from 'react';
import NavBar from '../components/NavBar';

export default function MainLayout({ children }) {
  return (
    <div className="min-vh-100 bg-light">
      <NavBar />
      <main>
        {children}
      </main>
    </div>
  );
}