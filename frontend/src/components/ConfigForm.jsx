import React from 'react';
import { Mail, Shield, Type, FileText, Clock, CheckCircle, Send, Upload, Paperclip } from 'lucide-react';

export default function ConfigForm({ formData, setFormData, onUploadRecipients, onUploadAttachment, onSendTest }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sender & Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Gmail Sender Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              name="sender_email"
              value={formData.sender_email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="charity@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Google App Password
          </label>
          <div className="relative">
            <Shield className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="password"
              name="app_password"
              value={formData.app_password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="xxxx xxxx xxxx xxxx"
            />
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="remember_password"
              name="remember_password"
              checked={formData.remember_password}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 transition"
            />
            <label htmlFor="remember_password" className="text-xs text-slate-500 dark:text-slate-400">
              Remember Local App Password mapping context safely
            </label>
          </div>
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Mailing Outreach Target Upload (.csv / .xlsx)
          </label>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={onUploadRecipients}
            className="block w-full text-sm text-slate-500 dark:text-slate-400
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
              file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700
              dark:file:bg-indigo-900/30 dark:file:text-indigo-300
              hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50
              transition duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Global Shared Campaign Attachment (Optional)
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            onChange={onUploadAttachment}
            className="block w-full text-sm text-slate-500 dark:text-slate-400
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
              file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700
              dark:file:bg-slate-700 dark:file:text-slate-300
              hover:file:bg-slate-200 dark:hover:file:bg-slate-600
              transition duration-200"
          />
        </div>
      </div>

      {/* Delay */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Anti-Throttle Cooldown (Seconds Delay)
        </label>
        <div className="relative w-36">
          <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="number"
            name="delay_seconds"
            value={formData.delay_seconds}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
          />
        </div>
      </div>

      {/* Subject & Body */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Campaign Dynamic Subject String
          </label>
          <div className="relative">
            <Type className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="Partnership Opportunity with {{company}}"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Rich Interpolated Email Message Body Markdown
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={6}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder={`Hello {{name}},\n\nWe love your work at {{company}}. Let's build a CSR collaboration.\n\nWarm regards,\nNGO Team`}
          />
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 block">
            Supported Token Injections: {'{{name}}'}, {'{{company}}'}
          </span>
        </div>
      </div>

      {/* Test Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSendTest}
          className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
        >
          <Send className="w-4 h-4" />
          Send Live Local Loop Test Dispatch Validation
        </button>
      </div>
    </div>
  );
}