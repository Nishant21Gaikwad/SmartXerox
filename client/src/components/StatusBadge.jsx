import React from 'react';

const statusColors = {
  'In Queue': 'bg-gray-200 text-gray-800',
  'Printing': 'bg-blue-200 text-blue-800',
  'Ready': 'bg-green-200 text-green-800',
  'Delivered': 'bg-purple-200 text-purple-800',
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-200 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
