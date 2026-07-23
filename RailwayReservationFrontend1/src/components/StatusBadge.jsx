import React from 'react';
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function StatusBadge({ status }) {
  let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = Clock;

  switch (status?.toUpperCase()) {
    case 'BOOKED':
    case 'SUCCESS':
    case 'CONFIRMED':
      colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      Icon = CheckCircle2;
      break;
    case 'CANCELLED':
    case 'FAILED':
      colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      Icon = XCircle;
      break;
    case 'REFUNDED':
      colorClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      Icon = RefreshCw;
      break;
    case 'PENDING':
      colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      Icon = Clock;
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{status || 'UNKNOWN'}</span>
    </span>
  );
}
