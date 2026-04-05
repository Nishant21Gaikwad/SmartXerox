import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import OrderGroup from '../components/OrderGroup';

const StudentPanel = () => {
  const navigate = useNavigate();
  
  // Load authenticated user from localStorage
  const savedUser = JSON.parse(localStorage.getItem('smartxerox_user') || '{}');
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('smartxerox_token');
    if (!token || !savedUser.id) {
      navigate('/login');
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    student_name: savedUser.name || '',
    phone_number: savedUser.phone || '',
  });
  const [filesList, setFilesList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isPreviewableFile = (file) => {
    return ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
  };

  const handlePreviewFile = (file) => {
    if (!isPreviewableFile(file)) {
      setError('Preview is available only for PDF, JPG, and PNG files.');
      return;
    }

    setError('');
    const previewUrl = URL.createObjectURL(file);
    window.open(previewUrl, '_blank', 'noopener,noreferrer');

    // Revoke shortly after opening to avoid leaking blob URLs.
    setTimeout(() => URL.revokeObjectURL(previewUrl), 60_000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;

    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File size must be less than 10MB`);
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/jpg', 
        'image/png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
      ];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Only PDF, JPG, PNG, DOCX, PPT, and PPTX files are allowed`);
        return;
      }

      validFiles.push({
        id: Date.now() + Math.random(),
        file: file,
        copies: 1,
        color_type: 'B&W',
        note: '',
      });
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      setError('');
    }

    if (validFiles.length > 0) {
      setFilesList([...filesList, ...validFiles]);
      e.target.value = ''; // Reset input
    }
  };

  const updateFileSettings = (id, field, value) => {
    setFilesList(filesList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeFile = (id) => {
    setFilesList(filesList.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (filesList.length === 0) {
      setError('Please add at least one file to upload');
      return;
    }

    setLoading(true);

    try {
      let successCount = 0;
      let failCount = 0;

      // Upload each file
      for (const fileItem of filesList) {
        try {
          const formDataToSend = new FormData();
          formDataToSend.append('copies', fileItem.copies);
          formDataToSend.append('color_type', fileItem.color_type);
          formDataToSend.append('note', fileItem.note || '');
          formDataToSend.append('file', fileItem.file);

          const response = await ordersAPI.createOrder(formDataToSend);
          
          if (response.success) {
            successCount++;
          }
        } catch (err) {
          failCount++;
          console.error('Failed to upload:', fileItem.file.name, err);
        }
      }

      if (successCount > 0) {
        setSuccess(`Successfully uploaded ${successCount} file(s)!${failCount > 0 ? ` (${failCount} failed)` : ''}`);
        setFilesList([]); // Clear files list
        
        // Auto-load orders for this user
        fetchOrders();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to upload files. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getOrdersByPhone();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smartxerox_token');
    localStorage.removeItem('smartxerox_user');
    navigate('/login');
  };

  // Auto-load orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await ordersAPI.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setSuccess('Order deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order');
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="section-title mb-1 text-slate-900">Student Dashboard</h1>
            <p className="text-xs text-slate-500 sm:text-sm">Submit files, track status, and monitor your live queue.</p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button type="button" className="btn btn-primary px-3 py-1.5 text-xs sm:text-sm">
              Orders
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/queue')}
              className="btn btn-ghost px-3 py-1.5 text-xs sm:text-sm"
            >
              Live Queue
            </button>
          </div>
        </div>

        {error && <div className="info-banner error whitespace-pre-line">{error}</div>}
        {success && <div className="info-banner success">{success}</div>}

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
          <div>
            <h2 className="section-title mb-3 text-slate-900 sm:mb-4">Submit New Order</h2>

            <form onSubmit={handleSubmit} className="card space-y-3 sm:space-y-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">Student Profile</h3>
                <button type="button" onClick={handleLogout} className="btn btn-ghost px-2.5 py-1.5 text-xs">
                  Logout
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleInputChange}
                  className="input bg-slate-100"
                  disabled
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="input bg-slate-100"
                  disabled
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-3">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                  Add Files (PDF, JPG, PNG, DOCX, PPT, PPTX)
                </label>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="input"
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.ppt,.pptx"
                  multiple
                />
                <p className="mt-2 text-xs text-slate-500">Max file size: 10MB each.</p>
              </div>

              {filesList.length > 0 && (
                <div className="max-h-96 space-y-2.5 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
                  <h4 className="flex items-center justify-between text-sm font-bold text-slate-800 sm:text-base">
                    <span>Draft Files ({filesList.length})</span>
                    <button type="button" onClick={() => setFilesList([])} className="btn btn-ghost px-2 py-1 text-xs">
                      Clear all
                    </button>
                  </h4>

                  {filesList.map((fileItem) => (
                    <div key={fileItem.id} className="rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="break-all text-xs font-bold text-slate-900 sm:text-sm">{fileItem.file.name}</p>
                          <p className="text-xs text-slate-500">{(fileItem.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePreviewFile(fileItem.file)}
                            disabled={!isPreviewableFile(fileItem.file)}
                            className="btn btn-ghost px-2 py-1 text-xs"
                            title={isPreviewableFile(fileItem.file) ? 'Preview file' : 'Preview supported only for PDF, JPG, PNG'}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(fileItem.id)}
                            className="btn btn-ghost px-2 py-1 text-xs text-red-600 hover:border-red-200 hover:bg-red-50"
                            title="Remove file"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Copies</label>
                          <input
                            type="number"
                            value={fileItem.copies}
                            onChange={(e) => updateFileSettings(fileItem.id, 'copies', parseInt(e.target.value))}
                            className="input px-2.5 py-2 text-sm"
                            min="1"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Type</label>
                          <select
                            value={fileItem.color_type}
                            onChange={(e) => updateFileSettings(fileItem.id, 'color_type', e.target.value)}
                            className="input px-2.5 py-2 text-sm"
                          >
                            <option value="B&W">B&W</option>
                            <option value="Color">Color</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-500">Note (optional)</label>
                        <textarea
                          value={fileItem.note}
                          onChange={(e) => updateFileSettings(fileItem.id, 'note', e.target.value.slice(0, 250))}
                          className="input resize-none px-2.5 py-2 text-sm"
                          rows="2"
                          placeholder="Example: staple this file or urgent by 5 PM"
                        />
                        <p className="mt-1 text-right text-[11px] text-slate-500">{fileItem.note.length}/250</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || filesList.length === 0}
                className={`btn w-full ${filesList.length === 0 ? 'btn-secondary' : 'btn-primary'}`}
              >
                {loading ? 'Uploading...' : `Submit ${filesList.length > 0 ? `${filesList.length} Order(s)` : 'Orders'}`}
              </button>

              {formData.student_name && formData.phone_number && filesList.length === 0 && (
                <p className="text-center text-xs text-slate-500">Your profile is loaded. Add files to continue.</p>
              )}

              {filesList.length > 0 && (
                <p className="text-center text-xs font-bold text-emerald-700">Ready to upload {filesList.length} file(s)</p>
              )}
            </form>
          </div>

          <div>
            <h2 className="section-title mb-3 text-slate-900 sm:mb-4">My Orders</h2>

            {loading ? (
              <div className="card py-10 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-sky-600"></div>
                <p className="mt-2 text-sm text-slate-500">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <OrderGroup orders={orders} onDelete={handleDeleteOrder} showDelete={true} />
              </div>
            ) : (
              <div className="card py-8 text-center text-slate-500">
                <p className="mb-2 text-sm font-bold sm:text-base">No orders yet</p>
                <p className="text-xs sm:text-sm">Upload files to create your first mission.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
