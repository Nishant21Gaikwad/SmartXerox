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

  const formatSubmittedAt = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
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
        <div key={groupIndex} className="card hover-lift animate-rise">
          <div className="mb-3 rounded-2xl border border-slate-100 bg-white/80 p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">{group.student_name}</h3>
                <p className="text-xs font-semibold text-slate-500 sm:text-sm">{group.phone_number}</p>
              </div>
              <div className="space-y-1 text-left sm:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Submitted</p>
                <p className="text-xs font-bold text-slate-700 sm:text-sm">{formatSubmittedAt(group.created_at)}</p>
              </div>
            </div>

            {isAdmin && group.orders.length > 1 && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                  Quick update all files
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkStatusChange(group, 'In Queue')}
                    className="btn btn-secondary px-3 py-1.5 text-xs"
                  >
                    In Queue
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange(group, 'Printing')}
                    className="btn btn-secondary px-3 py-1.5 text-xs"
                  >
                    Printing
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange(group, 'Ready')}
                    className="btn btn-secondary px-3 py-1.5 text-xs"
                  >
                    Ready
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange(group, 'Delivered')}
                    className="btn btn-secondary px-3 py-1.5 text-xs"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {group.orders.map((order, orderIndex) => (
              <div key={order.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-3.5">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
                        File {orderIndex + 1}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  {isAdmin && group.orders.length === 1 && (
                    <select
                      value={order.status}
                      onChange={(e) => window.updateOrderStatus && window.updateOrderStatus(order.id, e.target.value)}
                      className="input ml-2 max-w-[135px] px-2.5 py-1.5 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="In Queue">In Queue</option>
                      <option value="Printing">Printing</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  )}
                </div>

                <div className="mb-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  <div className="rounded-xl bg-white px-2.5 py-2 soft-ring">
                    <span className="text-slate-500">Copies:</span>
                    <span className="ml-1 font-bold text-slate-700">{order.copies}</span>
                  </div>
                  <div className="rounded-xl bg-white px-2.5 py-2 soft-ring">
                    <span className="text-slate-500">Type:</span>
                    <span className="ml-1 font-bold text-slate-700">{order.color_type}</span>
                  </div>
                  <div className="col-span-2 rounded-xl bg-white px-2.5 py-2 soft-ring sm:col-span-1">
                    <span className="text-slate-500">At:</span>
                    <span className="ml-1 font-bold text-slate-700">{formatSubmittedAt(order.created_at)}</span>
                  </div>
                </div>

                {order.note && (
                  <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2">
                    <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800">Note</p>
                    <p className="break-words text-xs text-amber-900">{order.note}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {isAdmin ? (
                    <a
                      href={order.file_url}
                      download
                      className="btn btn-primary flex-1 py-1.5 text-xs sm:py-2"
                    >
                      Download
                    </a>
                  ) : (
                    <a
                      href={order.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary flex-1 py-1.5 text-xs sm:py-2"
                    >
                      View
                    </a>
                  )}
                  {showDelete && onDelete && (
                    <button
                      onClick={() => onDelete(order.id)}
                      className="btn btn-danger px-2.5 py-1.5 text-xs sm:px-3 sm:py-2"
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
};

export default OrderGroup;
