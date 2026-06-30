import React from 'react';
import { Search, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function LiveLogs({ logs, searchLog, setSearchLog }) {
  const getLogIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'info': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'error': return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Filter logs..."
          value={searchLog}
          onChange={(e) => setSearchLog(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
        />
      </div>

      {/* Log list */}
      <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
            No logs to display
          </div>
        ) : (
          <ul className="space-y-1.5">
            {logs.map((log, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="mt-0.5">{getLogIcon(log.level)}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                  {formatTime(log.timestamp)}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300 break-all flex-1">
                  {log.message}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Log count */}
      <div className="text-xs text-slate-400 dark:text-slate-500 text-right">
        {logs.length} entries
      </div>
    </div>
  );
}