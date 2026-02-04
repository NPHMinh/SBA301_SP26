import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FolderTree, 
  Newspaper, 
  UserCircle, 
  LogOut,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="layout-sidebar">
      {/* Branding Section */}
      <div className="p-6 border-b border-white border-opacity-10 mb-4">
        <div className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-600 font-bold">
            FN
          </div>
          <span className="text-xl font-bold text-white tracking-tight">FUNews</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-menu px-3">
        {user.accountRole === 1 && (
          <div className="mb-4">
            <div className="px-3 mb-2 text-xs font-bold text-gray-500 text-uppercase tracking-wider">Administration</div>
            <NavLink to="/admin/accounts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Accounts</span>
            </NavLink>
          </div>
        )}
        
        {user.accountRole === 2 && (
          <div className="mb-4">
            <div className="px-3 mb-2 text-xs font-bold text-gray-500 text-uppercase tracking-wider">Content System</div>
            <NavLink to="/staff/categories" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FolderTree size={18} />
              <span>Categories</span>
            </NavLink>
            <NavLink to="/staff/news" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Newspaper size={18} />
              <span>News Articles</span>
            </NavLink>
          </div>
        )}

        <div className="mb-4">
          <div className="px-3 mb-2 text-xs font-bold text-gray-500 text-uppercase tracking-wider">Account</div>
          <NavLink to="/staff/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserCircle size={18} />
            <span>My Profile</span>
          </NavLink>
        </div>
      </nav>

      {/* User Session */}
      <div className="sidebar-user mt-auto p-4 mx-3 mb-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-5">
        <div className="user-avatar shadow-sm">
          {user.accountName?.charAt(0)}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-semibold truncate text-white">{user.accountName}</div>
          <div className="text-xs text-gray-400 truncate opacity-60">{user.accountRole === 1 ? 'Administrator' : 'Staff'}</div>
        </div>
        <button 
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-400 transition-all rounded-lg hover:bg-red-500 hover:bg-opacity-10"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
