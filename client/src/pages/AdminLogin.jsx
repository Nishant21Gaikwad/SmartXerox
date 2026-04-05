import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect to admin dashboard if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminAPI.login(credentials.email, credentials.password);
      
      if (response.success) {
        // Ensure admin sessions never carry student credentials.
        localStorage.removeItem('smartxerox_token');
        localStorage.removeItem('smartxerox_user');
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-3 py-8 sm:px-4">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">SmartXerox</p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">Admin Command</h1>
          <p className="mt-1 text-sm text-slate-600">Secure access for managing print operations.</p>
        </div>

        <div className="card animate-rise">
          {error && <div className="info-banner error">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="input"
                required
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="input"
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Logging in...' : 'Enter Dashboard'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <a href="/" className="text-xs font-bold text-brand hover:text-sky-700 sm:text-sm">
              Back to Student Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
