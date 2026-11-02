import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeUploader } from '../components/resume/ResumeUploader.jsx';
import { JobDescriptionInput } from '../components/resume/JobDescriptionInput.jsx';
import { Button } from '../components/common/Button.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { analysisService } from '../services/analysisService.js';
import { validateResumeFile, validateJobDescription } from '../utils/validators.js';
import { ArrowRight, FileText } from 'lucide-react';

/**
 * Step-by-step resume analysis form (Upload Resume + Job Description + Submit)
 */
export function AnalyzeResume() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [fileError, setFileError] = useState(undefined);
  const [jobDescError, setJobDescError] = useState(undefined);
  const [generalError, setGeneralError] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    // Strict client validation before submission
    const fileValidation = selectedFile
      ? validateResumeFile(selectedFile)
      : { isValid: false, error: 'Please upload a resume file (.pdf or .docx) to proceed.' };
    const jobValidation = validateJobDescription(jobDescription);

    let hasError = false;
    if (!fileValidation.isValid) {
      setFileError(fileValidation.error);
      hasError = true;
    } else {
      setFileError(undefined);
    }

    if (!jobValidation.isValid) {
      setJobDescError(jobValidation.error);
      hasError = true;
    } else {
      setJobDescError(undefined);
    }

    if (hasError || !selectedFile) return;

    setIsAnalyzing(true);
    setUploadProgress(0);
    setAnalysisStage('Uploading resume for text extraction...');

    try {
      const { resumeText, fileName } = await analysisService.uploadResume(selectedFile, (progress) => {
        setUploadProgress(Math.round(progress * 0.7));
      });
      setUploadProgress(70);
      setAnalysisStage('Comparing your resume with the job description...');
      const result = await analysisService.analyzeResume(
        resumeText,
        jobDescription.trim(),
        fileName || selectedFile.name
      );

      navigate(`/dashboard/results/${result.id}`, {
        state: {
          analysis: {
            ...result,
            resumeFileName: result.resumeFileName || fileName || selectedFile.name,
            resumeFileSize: selectedFile.size,
          },
        },
      });
    } catch (err) {
      setGeneralError(
        err.message || 'Failed to complete resume analysis. Please verify your connection and try again.'
      );
      setIsAnalyzing(false);
      setUploadProgress(0);
      setAnalysisStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="cf-page-title text-3xl sm:text-4xl tracking-tight text-slate-900">
          Analyze Resume Compatibility
        </h1>
        <p className="cf-measure text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
          Upload a resume and the job description you want to compare it with. Your report includes a match score,
          matched and missing skills, strengths, and suggestions.
        </p>
      </div>

      {generalError && (
        <Alert type="error" onClose={() => setGeneralError(null)}>
          {generalError}
        </Alert>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Step 1: File Uploader */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
          <ResumeUploader
            selectedFile={selectedFile}
            onFileSelect={(file) => {
              setSelectedFile(file);
              setFileError(undefined);
            }}
            error={fileError}
            onErrorChange={setFileError}
            disabled={isAnalyzing}
          />
        </div>

        {/* Step 2: Job Description */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
          <JobDescriptionInput
            value={jobDescription}
            onChange={(val) => {
              setJobDescription(val);
              if (jobDescError) setJobDescError(undefined);
            }}
            error={jobDescError}
            disabled={isAnalyzing}
          />
        </div>

        {/* Progress or Submit Banner */}
        {isAnalyzing ? (
          <div className="bg-white rounded-2xl border border-indigo-200 p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span>{analysisStage || 'Analyzing compatibility...'}</span>
              </span>
              <span className="font-mono text-indigo-600 tabular-nums">{uploadProgress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(10, uploadProgress)}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-400 text-center">
              Please keep this page open while the AI evaluates your resume against the job description...
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Your report compares the resume and role description you submit.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!selectedFile || !jobDescription.trim()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Analyze Resume
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
