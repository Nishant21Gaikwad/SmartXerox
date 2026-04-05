import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (response.success) {
        setSuccess('Registration successful! Please verify your email, then login. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <p className="status-pill border-teal-200 bg-teal-50 text-teal-700">Level 1 Unlock</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Create Your Print Identity</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Your account stores your submission flow, order timeline, and allows quick repeat uploads.
            </p>

            <div className="mt-5 grid gap-2.5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">One-time setup</p>
                <p className="text-xs text-slate-500">Register once and use the same profile every day.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">Phone matters</p>
                <p className="text-xs text-slate-500">Use a valid phone number for tracking and support.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">Fast dashboard access</p>
                <p className="text-xs text-slate-500">Login after registration and start submitting files immediately.</p>
              </div>
            </div>
          </div>

          <div className="card animate-rise">
            <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Student Registration
            </h2>
            <p className="mt-1 text-center text-sm text-slate-500">Create your account and begin your print flow.</p>

            {error && <div className="info-banner error mt-4">{error}</div>}
            {success && <div className="info-banner success mt-4">{success}</div>}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="Enter your full name"
                />
              </div>

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
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input border-amber-300 focus:border-amber-500"
                  required
                  placeholder="10-digit phone number"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                  <p className="text-xs font-semibold text-amber-800">
                    Use your active phone number. It helps with tracking and support.
                  </p>
                </div>
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
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="Re-enter your password"
                  minLength={6}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary mt-1 w-full">
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-slate-600 sm:text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-brand hover:text-sky-700">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
