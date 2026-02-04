import React, { Fragment } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Search, Bell, ChevronRight, User } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    // Simple Breadcrumb logic
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    return (
        <header className="layout-header">
            <div className="flex items-center gap-4"></div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl px-8 hidden md:block">
                <div className="relative group">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />
                    <input 
                        type="text" 
                        placeholder="Search for articles, users..." 
                        className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 rounded-xl py-2 pl-10 pr-4 text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:text-primary hover:bg-indigo-50 rounded-lg transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="w-px h-6 bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-gray-900 leading-tight">{user.accountName}</div>
                        <div className="text-xs text-gray-500 font-medium">{user.accountRole === 1 ? 'Administrator' : 'Staff Member'}</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
                        {user.accountName?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
