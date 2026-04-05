import React from 'react';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order, onDelete, showDelete = true }) => {
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

  return (
    <div className="card hover-lift">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">{order.student_name}</h3>
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">{order.phone_number}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm rounded-xl bg-slate-50 px-3 py-2">
          <span className="text-slate-500">Copies:</span>
          <span className="font-bold text-slate-700">{order.copies}</span>
        </div>
        <div className="flex justify-between text-sm rounded-xl bg-slate-50 px-3 py-2">
          <span className="text-slate-500">Type:</span>
          <span className="font-bold text-slate-700">{order.color_type}</span>
        </div>
        <div className="flex justify-between text-sm rounded-xl bg-slate-50 px-3 py-2">
          <span className="text-slate-500">Submitted:</span>
          <span className="font-bold text-slate-700">{formatSubmittedAt(order.created_at)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={order.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex-1"
        >
          View File
        </a>
        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(order.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
