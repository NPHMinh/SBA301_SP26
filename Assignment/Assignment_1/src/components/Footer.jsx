import React from 'react';

const Footer = () => {
  return (
    <footer className="layout-footer">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} FUNews Management System. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
