import React, { useState } from 'react';
import { Copy, Check, FileSignature } from 'lucide-react';

/**
 * Suggested professional summary statement with one-click clipboard copy
 */
export function SummaryCard({ summary = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 rounded-xl border border-indigo-100/90 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-indigo-100/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <FileSignature className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Suggested Professional Summary</h3>
            <p className="text-xs text-slate-500">Suggested from the submitted materials</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-xs active:scale-[0.98]"
          aria-label="Copy professional summary to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="relative bg-white/80 rounded-lg p-4 border border-indigo-50 text-sm text-slate-800 leading-relaxed font-sans italic">
        "{summary}"
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Review this suggestion and edit it to reflect your experience before using it.
      </p>
    </div>
  );
}
