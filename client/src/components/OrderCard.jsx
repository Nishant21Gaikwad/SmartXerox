import React from 'react';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order, onDelete, showDelete = true }) => {
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

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{order.student_name}</h3>
          <p className="text-sm text-gray-600">{order.phone_number}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Copies:</span>
          <span className="font-medium">{order.copies}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium">{order.color_type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Submitted:</span>
          <span className="font-medium">{formatDate(order.created_at)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Expires in:</span>
          <span className="font-medium text-orange-600">{getTimeRemaining(order.created_at)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={order.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex-1 text-center"
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
