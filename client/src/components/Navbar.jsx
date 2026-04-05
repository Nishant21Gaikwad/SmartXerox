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
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 frost-panel">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-[74px]">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
              <img
                src="/logo.svg"
                alt="SmartXerox logo"
                className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              />
            </div>
            <div>
              <h1 className="text-base font-extrabold leading-none text-slate-900 sm:text-xl">SmartXerox</h1>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                {isAdmin ? 'Admin Mission' : 'Student Studio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin ? (
              <>
                <span className="status-pill hidden border-amber-200 bg-amber-50 text-amber-700 sm:inline-flex">
                  Control Room
                </span>
                <button
                  onClick={onLogout}
                  className="btn btn-secondary px-3 py-2 text-xs sm:px-4 sm:text-sm"
                >
                  Logout
                </button>
              </>
            ) : isLoggedIn && user.name ? (
              <>
                <span className="status-pill hidden border-emerald-200 bg-emerald-50 text-emerald-700 sm:inline-flex">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary px-3 py-2 text-xs sm:px-4 sm:text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="/admin" className="btn btn-ghost px-3 py-2 text-xs sm:text-sm">
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
