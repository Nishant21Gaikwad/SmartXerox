import React from 'react';
import StatusBadge from './StatusBadge';

const OrderGroup = ({ orders, onDelete, showDelete = true, isAdmin = false }) => {
  if (!orders || orders.length === 0) return null;

  // Group orders by student (same name and phone within 5 minutes)
  const groupedOrders = [];
  let currentGroup = null;

  orders.forEach((order) => {
    if (!currentGroup) {
      currentGroup = {
        student_name: order.student_name,
        phone_number: order.phone_number,
        created_at: order.created_at,
        orders: [order]
      };
    } else {
      // Check if same student and within 5 minutes
      const timeDiff = Math.abs(new Date(order.created_at) - new Date(currentGroup.created_at));
      const isSameStudent = order.student_name === currentGroup.student_name && 
                           order.phone_number === currentGroup.phone_number;
      const isWithinTimeWindow = timeDiff < 5 * 60 * 1000; // 5 minutes

      if (isSameStudent && isWithinTimeWindow) {
        currentGroup.orders.push(order);
      } else {
        groupedOrders.push(currentGroup);
        currentGroup = {
          student_name: order.student_name,
          phone_number: order.phone_number,
          created_at: order.created_at,
          orders: [order]
        };
      }
    }
  });

  if (currentGroup) {
    groupedOrders.push(currentGroup);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (createdAt) => {
    const created = new Date(createdAt);
    const expiryTime = new Date(created.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const remaining = expiryTime - now;

    if (remaining <= 0) return 'Expired';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const getTotalCopies = (orders) => {
    return orders.reduce((sum, order) => sum + order.copies, 0);
  };

  const getStatusSummary = (orders) => {
    const statuses = {};
    orders.forEach(order => {
      statuses[order.status] = (statuses[order.status] || 0) + 1;
    });
    return statuses;
  };

  const handleBulkStatusChange = (group, newStatus) => {
    if (!window.updateOrderStatus) return;
    
    // Update all orders in the group
    group.orders.forEach(order => {
      window.updateOrderStatus(order.id, newStatus);
    });
  };

  return (
    <>
      {groupedOrders.map((group, groupIndex) => (
        <div key={groupIndex} className="card hover:shadow-lg transition-shadow">
          {/* Student Header */}
          <div className="border-b pb-3 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{group.student_name}</h3>
                <p className="text-sm text-gray-600">{group.phone_number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="text-sm font-medium">{formatDate(group.created_at)}</p>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  ⏱️ {getTimeRemaining(group.created_at)}
                </p>
              </div>
            </div>

            {/* Bulk Status Update for Admin (only for multiple files) */}
            {isAdmin && group.orders.length > 1 && (
              <div className="mt-3 pt-3 border-t bg-blue-50 -mx-4 px-4 py-2 rounded-b-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-700">
                    🔄 Update all {group.orders.length} files:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkStatusChange(group, 'In Queue')}
                      className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      In Queue
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange(group, 'Printing')}
                      className="text-xs px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded transition-colors"
                    >
                      Printing
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange(group, 'Ready')}
                      className="text-xs px-3 py-1 bg-green-200 hover:bg-green-300 rounded transition-colors"
                    >
                      Ready
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange(group, 'Delivered')}
                      className="text-xs px-3 py-1 bg-purple-200 hover:bg-purple-300 rounded transition-colors"
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Files List */}
          <div className="space-y-2">
            {group.orders.map((order, orderIndex) => (
              <div key={order.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        File {orderIndex + 1}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  {/* Show individual dropdown only for single file or non-admin */}
                  {isAdmin && group.orders.length === 1 && (
                    <select
                      value={order.status}
                      onChange={(e) => window.updateOrderStatus && window.updateOrderStatus(order.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="In Queue">In Queue</option>
                      <option value="Printing">Printing</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-gray-600">Copies:</span>
                    <span className="ml-1 font-medium">{order.copies}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-1 font-medium">{order.color_type}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isAdmin ? (
                    <a
                      href={order.file_url}
                      download
                      className="text-xs btn btn-primary flex-1 text-center py-1"
                    >
                      📥 Download File
                    </a>
                  ) : (
                    <a
                      href={order.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs btn btn-primary flex-1 text-center py-1"
                    >
                      📥 View File
                    </a>
                  )}
                  {showDelete && onDelete && (
                    <button
                      onClick={() => onDelete(order.id)}
                      className="text-xs btn btn-danger py-1 px-3"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              ))}
          </div>
        </div>
      ))}
    </>
  );
};export default OrderGroup;
