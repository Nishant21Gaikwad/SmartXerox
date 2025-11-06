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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">📄 SmartXerox</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {isAdmin ? (
              <>
                <span className="hidden sm:inline text-xs sm:text-sm text-gray-600">Admin Panel</span>
                <button
                  onClick={onLogout}
                  className="btn btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                  Logout
                </button>
              </>
            ) : isLoggedIn && user.name ? (
              <>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="/admin" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
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
