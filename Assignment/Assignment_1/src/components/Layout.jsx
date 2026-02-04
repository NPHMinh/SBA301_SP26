import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <Header />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
