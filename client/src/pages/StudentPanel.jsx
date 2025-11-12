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
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
      ];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Only PDF, JPG, PNG, and DOCX files are allowed`);
        return;
      }

      validFiles.push({
        id: Date.now() + Math.random(),
        file: file,
        copies: 1,
        color_type: 'B&W',
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
          formDataToSend.append('student_name', formData.student_name);
          formDataToSend.append('phone_number', formData.phone_number);
          formDataToSend.append('copies', fileItem.copies);
          formDataToSend.append('color_type', fileItem.color_type);
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
        fetchOrders(formData.phone_number);
        
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

  const fetchOrders = async (phone) => {
    if (!phone) return;
    
    setLoading(true);
    try {
      const response = await ordersAPI.getOrdersByPhone(phone);
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
    if (savedUser.phone) {
      fetchOrders(savedUser.phone);
    }
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await ordersAPI.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setSuccess('Order deleted successfully');
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Upload Form */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">📤 Submit New Order</h2>
            
            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm whitespace-pre-line">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="card space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700">Your Information</h3>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                >
                  Logout
                </button>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleInputChange}
                  className="input bg-gray-100 text-sm sm:text-base"
                  disabled
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="input bg-gray-100 text-sm sm:text-base"
                  disabled
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Add Files to Upload</h3>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  📎 Select Files (PDF, JPG, PNG, DOCX - Max 10MB each)
                </label>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="input text-sm sm:text-base"
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  multiple
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 You can select multiple files at once or add them one by one
                </p>
              </div>

              {/* Files List */}
              {filesList.length > 0 && (
                <div className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 flex items-center justify-between">
                    <span>Files to Upload ({filesList.length})</span>
                    <button
                      type="button"
                      onClick={() => setFilesList([])}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                    >
                      Clear All
                    </button>
                  </h4>
                  
                  {filesList.map((fileItem) => (
                    <div key={fileItem.id} className="bg-gray-50 rounded p-2 sm:p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 break-all">
                            📄 {fileItem.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(fileItem.id)}
                          className="flex-shrink-0 text-red-600 hover:text-red-800 text-lg"
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Copies</label>
                          <input
                            type="number"
                            value={fileItem.copies}
                            onChange={(e) => updateFileSettings(fileItem.id, 'copies', parseInt(e.target.value))}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Type</label>
                          <select
                            value={fileItem.color_type}
                            onChange={(e) => updateFileSettings(fileItem.id, 'color_type', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="B&W">B&W</option>
                            <option value="Color">Color</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || filesList.length === 0}
                className={`btn w-full text-sm sm:text-base ${filesList.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
              >
                {loading ? 'Uploading...' : `📤 Submit ${filesList.length > 0 ? `${filesList.length} Order(s)` : 'Orders'}`}
              </button>

              {formData.student_name && formData.phone_number && filesList.length === 0 && (
                <p className="text-xs text-center text-gray-600">
                  💡 Your info is saved! Just add files and submit.
                </p>
              )}
              
              {filesList.length > 0 && (
                <p className="text-xs text-center text-green-600 font-medium">
                  ✓ Ready to upload {filesList.length} file(s)
                </p>
              )}
            </form>
          </div>

          {/* My Orders */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">📋 My Orders</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <OrderGroup orders={orders} onDelete={handleDeleteOrder} showDelete={true} />
              </div>
            ) : (
              <div className="card text-center py-6 sm:py-8 text-gray-500">
                <p className="mb-2 text-sm sm:text-base">📭 No orders yet</p>
                <p className="text-xs sm:text-sm">Upload files to create your first order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
