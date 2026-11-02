/**
 * Analysis service for submitting resumes, retrieving results and history
 * Plain JavaScript (ES6+) implementation connecting to Express MERN API
 */
import { apiClient } from './api.js';

function normalizeAnalysis(analysis) {
  if (!analysis || typeof analysis !== 'object') {
    throw new Error('The analysis API returned an invalid record.');
  }

  const id = analysis.id ?? analysis._id;
  if (id === undefined || id === null || String(id).trim() === '') {
    throw new Error('The analysis API returned a record without an ID.');
  }

  const resumeFileName = [analysis.resumeFileName, analysis.fileName].find(
    (fileName) => typeof fileName === 'string' && fileName.trim()
  );

  return {
    ...analysis,
    id: String(id),
    ...(resumeFileName ? { resumeFileName: resumeFileName.trim() } : {}),
  };
}

function unwrapAnalysis(data) {
  return normalizeAnalysis(data?.analysis);
}

export const analysisService = {
  /**
   * Upload a resume and extract its text before analysis.
   * @param {File} file
   * @param {Function} [onProgress] - Optional upload progress callback (0 - 100)
   * @returns {Promise<{fileName: string, resumeText: string}>}
   */
  async uploadResume(file, onProgress) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await apiClient.post('/resumes/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    const { resumeText, fileName } = response.data || {};
    if (typeof resumeText !== 'string' || !resumeText.trim()) {
      throw new Error('The resume upload did not return extracted resume text.');
    }

    return {
      resumeText,
      fileName: typeof fileName === 'string' && fileName.trim() ? fileName.trim() : file.name,
    };
  },

  /**
   * Analyze extracted resume text against a target job description.
   * @param {string} resumeText
   * @param {string} jobDescription
   * @returns {Promise<object>}
   */
  async analyzeResume(resumeText, jobDescription, resumeFileName = '') {
    const response = await apiClient.post('/analysis', {
      resumeText,
      jobDescription,
      resumeFileName,
    });
    return unwrapAnalysis(response.data);
  },

  /**
   * Retrieve all previous analyses for the authenticated user.
   * @returns {Promise<Array<object>>}
   */
  async getHistory() {
    const response = await apiClient.get('/analysis');
    const analyses = Array.isArray(response.data)
      ? response.data
      : response.data?.analyses;

    if (!Array.isArray(analyses)) {
      throw new Error('The analysis history API returned an invalid response.');
    }

    return analyses.map(normalizeAnalysis);
  },

  /**
   * Retrieve a specific analysis result by ID.
   * @param {string} id
   * @returns {Promise<object>}
   */
  async getAnalysisById(id) {
    const response = await apiClient.get(`/analysis/${id}`);
    return unwrapAnalysis(response.data);
  },

  /**
   * Calculate dashboard statistics from the authenticated user's analyses.
   * The backend does not expose a separate statistics endpoint.
   * @returns {Promise<object>}
   */
  async getDashboardStats() {
    const history = await this.getHistory();
    const scores = history
      .map((item) => item.matchScore)
      .filter((score) => typeof score === 'number' && Number.isFinite(score));

    return {
      totalAnalyses: history.length,
      averageMatchScore: scores.length
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0,
      latestAnalysis: history[0] || null,
      recentAnalyses: history.slice(0, 5),
    };
  },
};
