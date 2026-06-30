import React from 'react';
import { CheckCircle, XCircle, Loader, Users } from 'lucide-react';

export default function ProgressBar({ progress }) {
  const { status, total, sent, failed, current_index } = progress;
  const percentage = total > 0 ? Math.round((sent / total) * 100) : 0;
  const isActive = status === 'Running' || status === 'Paused';

  return (
    <div className="space-y-4">
      {/* Status badge and progress percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isActive ? (
            <Loader className="w-4 h-4 text-indigo-500 animate-spin" />
          ) : status === 'Stopped' ? (
            <XCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          )}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {status}
          </span>
        </div>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="text-center">
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">
            {total}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
            Total
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {sent}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
            Sent
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black text-rose-600 dark:text-rose-400">
            {failed}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
            Failed
          </div>
        </div>
      </div>

      {/* Optional: current index */}
      {isActive && (
        <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Processing recipient #{current_index + 1}
        </div>
      )}
    </div>
  );
}