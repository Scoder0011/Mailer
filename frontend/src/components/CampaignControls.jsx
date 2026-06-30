import React from 'react';
import { 
  Play, Pause, Square, RotateCcw, Download, 
  AlertCircle, Loader 
} from 'lucide-react';

export default function CampaignControls({ 
  status, onStart, onPause, onResume, onStop, onRetry, onDownload 
}) {
  const isRunning = status === 'Running';
  const isPaused = status === 'Paused';
  const isStopped = status === 'Stopped' || status === 'Completed' || status === 'Idle';

  return (
    <div className="space-y-4">
      {/* Primary action row */}
      <div className="flex flex-wrap gap-2">
        {!isRunning && !isPaused && (
          <button
            onClick={onStart}
            className="flex-1 min-w-[100px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
          >
            <Play className="w-4 h-4" /> Start
          </button>
        )}
        {isRunning && (
          <>
            <button
              onClick={onPause}
              className="flex-1 min-w-[80px] px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
            <button
              onClick={onStop}
              className="flex-1 min-w-[80px] px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          </>
        )}
        {isPaused && (
          <>
            <button
              onClick={onResume}
              className="flex-1 min-w-[80px] px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" /> Resume
            </button>
            <button
              onClick={onStop}
              className="flex-1 min-w-[80px] px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          </>
        )}
      </div>

      {/* Secondary action row */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRetry}
          disabled={isRunning || isPaused}
          className={`flex-1 min-w-[90px] px-4 py-2 rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm ${
            isRunning || isPaused
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Retry Failed
        </button>
        <button
          onClick={onDownload}
          className="flex-1 min-w-[90px] px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" /> Report
        </button>
      </div>

      {/* Status hint */}
      {isStopped && (
        <div className="text-xs text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          Campaign idle – press Start to begin
        </div>
      )}
    </div>
  );
}