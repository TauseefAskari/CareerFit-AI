import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, RefreshCw } from 'lucide-react';
import { validateResumeFile } from '../../utils/validators.js';
import { formatBytes } from '../../utils/formatters.js';

/**
 * Drag-and-drop resume upload zone with strict single-file validation
 * Supports .pdf and .docx (up to 5 MB). Warns against legacy .doc.
 */
export function ResumeUploader({
  selectedFile,
  onFileSelect,
  error,
  onErrorChange,
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileProcess = (file) => {
    if (!file) return;

    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      onErrorChange(validation.error);
      onFileSelect(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    onErrorChange(undefined);
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 1) {
      onErrorChange('Multiple files detected. Please upload only a single resume file (.pdf or .docx).');
      return;
    }

    if (files.length === 1) {
      handleFileProcess(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    onErrorChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileTypeLabel = (file) => {
    const lower = (file.name || '').toLowerCase();
    if (lower.endsWith('.pdf')) return 'PDF Document';
    if (lower.endsWith('.docx')) return 'Word Document (.docx)';
    return file.type || 'Document';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Step 1: Upload Resume <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500 font-medium">Single file · Max 5 MB</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        id="resume-file-input"
        aria-label="Upload resume file in PDF or DOCX format"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-label="Choose a PDF or DOCX resume, or drop it here"
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' : ''
          } ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.005]'
              : error
              ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
              : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                <span className="text-indigo-600 hover:underline">Click to browse</span> or drag & drop your resume
              </p>
              <p className="text-xs text-slate-500">
                Supports <strong className="text-slate-700">.PDF</strong> and <strong className="text-slate-700">.DOCX</strong> (Up to 5 MB)
              </p>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-100/80 rounded-md py-1.5 px-3 inline-block">
              Note: Legacy <code className="text-slate-600 font-mono">.doc</code> files are not supported. Convert to .docx or PDF before uploading.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{selectedFile.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{getFileTypeLabel(selectedFile)}</span>
                <span aria-hidden="true">·</span>
                <span>{formatBytes(selectedFile.size)}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center text-emerald-600 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Ready
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-md hover:bg-rose-50 transition-colors"
              aria-label="Remove selected resume file"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}
