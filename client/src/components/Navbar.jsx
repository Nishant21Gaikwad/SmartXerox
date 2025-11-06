import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAdmin = false, onLogout = null }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('smartxerox_user') || '{}');
  const isLoggedIn = !!localStorage.getItem('smartxerox_token');

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('smartxerox_token');
      localStorage.removeItem('smartxerox_user');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">📄 SmartXerox</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <>
                <span className="text-sm text-gray-600">Admin Panel</span>
                <button
                  onClick={onLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : isLoggedIn && user.name ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">👤 {user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="/admin" className="text-sm text-blue-600 hover:text-blue-800">
                Admin Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
