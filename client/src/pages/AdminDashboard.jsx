import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import OrderGroup from '../components/OrderGroup';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchOrders();
    fetchStats();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllOrders(filterStatus || null);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      fetchStats();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  // Make status update available globally for OrderGroup component
  useEffect(() => {
    window.updateOrderStatus = handleStatusUpdate;
    return () => {
      delete window.updateOrderStatus;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">🛠️ Admin Dashboard</h2>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="card">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="card">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">In Queue</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-600">{stats.byStatus['In Queue']}</p>
            </div>
            <div className="card">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Ready</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.byStatus['Ready']}</p>
            </div>
            <div className="card">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Copies</h3>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.totalCopies}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Filter Controls */}
        <div className="card mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
            <span className="font-medium text-gray-700 text-sm sm:text-base">Filter by Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input flex-1 sm:max-w-xs text-sm sm:text-base"
            >
              <option value="">All Orders</option>
              <option value="In Queue">In Queue</option>
              <option value="Printing">Printing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button onClick={fetchOrders} className="btn btn-primary text-sm sm:text-base">
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <OrderGroup orders={orders} showDelete={false} isAdmin={true} />
          </div>
        ) : (
          <div className="card text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
