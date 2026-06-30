import React, { useState, useEffect } from 'react';
import ConfigForm from './components/ConfigForm';
import ProgressBar from './components/ProgressBar';
import CampaignControls from './components/CampaignControls';
import LiveLogs from './components/LiveLogs';
import { Sun, Moon, Heart, Upload, Paperclip, Send, Play, Pause, RotateCcw, Download, Square, AlertCircle } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchLog, setSearchLog] = useState("");
  const [formData, setFormData] = useState({
    sender_email: "",
    app_password: "",
    subject: "",
    body: "",
    delay_seconds: 15,
    remember_password: false
  });
  const [progress, setProgress] = useState({
    status: "Stopped",
    total: 0,
    sent: 0,
    failed: 0,
    current_index: 0
  });
  const [logs, setLogs] = useState([]);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/settings")
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          sender_email: data.sender_email || "",
          delay_seconds: data.delay_seconds || 15,
          subject: data.last_subject || "",
          app_password: data.saved_app_password || ""
        }));
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8000/api/progress")
        .then(res => res.json())
        .then(data => setProgress(data));

      fetch(`http://127.0.0.1:8000/api/logs?search=${searchLog}`)
        .then(res => res.json())
        .then(data => setLogs(data.logs));
    }, 2000);
    return () => clearInterval(interval);
  }, [searchLog]);

  const handleUploadRecipients = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-recipients", { method: "POST", body: data });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail);
      triggerToast(`✅ Successfully registered structural array mapping metadata rows: ${out.count}`);
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const handleUploadAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-attachment", { method: "POST", body: data });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail);
      triggerToast("📎 Attachment context structured tracking validated.");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const handleSendTest = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_email: formData.sender_email,
          app_password: formData.app_password,
          subject: formData.subject,
          body: formData.body
        })
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail);
      triggerToast("✉️ Test validation loop verification complete. Confirm incoming message inbox patterns.");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const handleStartCampaign = async () => {
    if (!window.confirm("Are you sure you want to start this campaign?")) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/start-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail);
      triggerToast("🚀 Campaign started successfully.");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const handleAction = async (endpoint) => {
    await fetch(`http://127.0.0.1:8000/api/${endpoint}`, { method: "POST" });
    triggerToast(`⚡ Dispatched: ${endpoint}`);
  };

  const handleRetryFailed = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/retry-failed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail);
      triggerToast("🔄 Dispatched exception remediation processing sequences.");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const handleDownloadReport = () => {
    window.open("http://127.0.0.1:8000/api/download-report", "_blank");
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-8">
        
        {/* Header with gradient and glow */}
        <header className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-800 dark:to-blue-800 px-6 py-5 flex items-center justify-between shadow-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyek0zNiAxNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          <div className="relative flex items-center gap-4">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-2xl text-white shadow-lg">
              <span className="font-black text-xl tracking-wider">Mailer</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">Mailer Core Platform</h1>
              <p className="text-xs text-indigo-100 font-medium">Local-First Decentralized Enterprise Outbox Environment</p>
            </div>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="relative p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 border border-white/20 text-white"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 max-w-sm px-5 py-4 rounded-2xl shadow-2xl text-white font-medium text-sm border backdrop-blur-sm transition-all duration-300 flex items-start gap-3 ${
            toast.type === 'error' 
              ? 'bg-rose-600/90 border-rose-400' 
              : 'bg-slate-800/90 border-slate-600 dark:bg-blue-600/90 dark:border-blue-400'
          }`}>
            <span className="mt-0.5">{toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : '✅'}</span>
            <span>{toast.msg}</span>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-300">
                  <Send className="w-4 h-4" />
                </span>
                Campaign Configuration
              </h2>
              <ConfigForm 
                formData={formData} 
                setFormData={setFormData} 
                onUploadRecipients={handleUploadRecipients}
                onUploadAttachment={handleUploadAttachment}
                onSendTest={handleSendTest}
              />
            </div>
          </div>

          {/* Right Column: Progress, Controls, Logs */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Campaign Progress</h3>
              <ProgressBar progress={progress} />
            </div>

            {/* Controls Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
              <CampaignControls 
                status={progress.status}
                onStart={handleStartCampaign}
                onPause={() => handleAction('pause-campaign')}
                onResume={() => handleAction('resume-campaign')}
                onStop={() => handleAction('stop-campaign')}
                onRetry={handleRetryFailed}
                onDownload={handleDownloadReport}
              />
            </div>

            {/* Logs Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
              <LiveLogs logs={logs} searchLog={searchLog} setSearchLog={setSearchLog} />
            </div>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto text-center py-6 text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center justify-center gap-1.5">
          Designed with structural data-integrity engineering pipelines for any teams worldwide.
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        </footer>
      </div>
    </div>
  );
}