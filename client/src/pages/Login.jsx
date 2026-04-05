import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to student panel if already logged in
  useEffect(() => {
    const token = localStorage.getItem('smartxerox_token');
    if (token) {
      navigate('/student');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      if (response.success) {
        // Ensure student sessions never reuse admin credentials.
        localStorage.removeItem('adminToken');

        // Store user data
        localStorage.setItem('smartxerox_token', response.token);
        localStorage.setItem('smartxerox_user', JSON.stringify(response.user));
        
        // Redirect to student panel
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card hidden lg:block">
            <p className="status-pill border-sky-200 bg-sky-50 text-sky-700">Welcome Back</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Resume Your Print Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Log in to upload files, manage print settings, and track progress in real-time from your dashboard.
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">Multi-file upload support</p>
                <p className="text-xs text-slate-500">Send assignments, notes, and reports together.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">Live status timeline</p>
                <p className="text-xs text-slate-500">In Queue → Printing → Ready → Delivered.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">Phone-first controls</p>
                <p className="text-xs text-slate-500">Optimized tap targets and fast forms.</p>
              </div>
            </div>
          </div>

          <div className="card animate-rise">
            <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Student Login
            </h2>
            <p className="mt-1 text-center text-sm text-slate-500">Enter your credentials to continue.</p>

            {error && <div className="info-banner error mt-4">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary mt-1 w-full">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-5 space-y-2 text-center">
              <p className="text-xs text-slate-600 sm:text-sm">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-bold text-brand hover:text-sky-700">
                  Register here
                </Link>
              </p>
              <p className="text-xs text-slate-600 sm:text-sm">
                <Link to="/admin" className="font-bold text-highlight hover:text-teal-700">
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
