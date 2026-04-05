import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import OrderGroup from '../components/OrderGroup';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingDelivered, setDeletingDelivered] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm('Delete this file and order permanently?');
    if (!confirmed) {
      return;
    }

    try {
      await ordersAPI.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      fetchStats();
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  const handleDeleteDeliveredOrders = async () => {
    const deliveredCount = stats?.byStatus?.Delivered ?? 0;
    if (deliveredCount <= 0) {
      setError('No delivered orders to delete');
      return;
    }

    const confirmed = window.confirm(
      `Delete all ${deliveredCount} delivered order(s) and their files permanently?`,
    );
    if (!confirmed) {
      return;
    }

    setDeletingDelivered(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminAPI.deleteDeliveredOrders();
      const deletedOrders = response?.data?.deletedOrders ?? 0;
      const deletedFiles = response?.data?.deletedFiles ?? 0;
      setSuccess(`Deleted ${deletedOrders} delivered order(s) and ${deletedFiles} file(s)`);
      await fetchOrders();
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete delivered orders');
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setDeletingDelivered(false);
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

  const formatBytes = (bytes) => {
    const safeBytes = Number(bytes || 0);
    if (safeBytes <= 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = safeBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }

    const fixed = unitIndex === 0 ? 0 : 2;
    return `${size.toFixed(fixed)} ${units[unitIndex]}`;
  };

  const deliveredCount = stats?.byStatus?.Delivered ?? 0;

  return (
    <div className="app-shell">
      <Navbar isAdmin={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Control Room</p>
            <h2 className="page-title text-slate-900">Admin Dashboard</h2>
          </div>
        </div>

        {stats && (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-7 sm:grid-cols-5 sm:gap-4">
            <div className="card p-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Total Orders</h3>
              <p className="mt-1 text-2xl font-extrabold text-brand sm:text-3xl">{stats.total}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">In Queue</h3>
              <p className="mt-1 text-2xl font-extrabold text-slate-600 sm:text-3xl">{stats.byStatus['In Queue']}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Ready</h3>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600 sm:text-3xl">{stats.byStatus['Ready']}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Total Copies</h3>
              <p className="mt-1 text-2xl font-extrabold text-highlight sm:text-3xl">{stats.totalCopies}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Today Upload Size</h3>
              <p className="mt-1 text-xl font-extrabold text-amber-600 sm:text-2xl">{formatBytes(stats.todayUploadBytes)}</p>
              <p className="mt-1 text-[11px] text-slate-500">Resets daily (IST)</p>
            </div>
          </div>
        )}

        {error && <div className="info-banner error">{error}</div>}
        {success && <div className="info-banner success">{success}</div>}

        <div className="card mb-4 sm:mb-6">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">Filter by Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input flex-1 sm:max-w-xs"
            >
              <option value="">All Orders</option>
              <option value="In Queue">In Queue</option>
              <option value="Printing">Printing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button onClick={fetchOrders} className="btn btn-primary">
              Refresh
            </button>
            <button
              onClick={handleDeleteDeliveredOrders}
              disabled={deletingDelivered || deliveredCount === 0}
              className="btn btn-danger"
            >
              {deletingDelivered ? 'Deleting...' : `Delete Delivered (${deliveredCount})`}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="card py-12 text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-sky-600 sm:h-12 sm:w-12"></div>
            <p className="mt-4 text-sm text-slate-500 sm:text-base">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <OrderGroup orders={orders} onDelete={handleDeleteOrder} showDelete={true} isAdmin={true} />
          </div>
        ) : (
          <div className="card py-8 text-center text-sm text-slate-500 sm:py-12 sm:text-base">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
