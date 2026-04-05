import React from 'react';

const statusColors = {
  'In Queue': 'border-slate-200 bg-slate-50 text-slate-700',
  'Printing': 'border-sky-200 bg-sky-50 text-sky-700',
  'Ready': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Delivered': 'border-teal-200 bg-teal-50 text-teal-700',
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusColors[status] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
