/**
 * Centralized Axios API instance for CareerFit AI
 * Plain JavaScript (ES6+) implementation
 */
import axios from 'axios';

// Keep local API calls same-origin; Vite proxies them to the configured backend.
export const API_BASE_URL = import.meta.env?.DEV
  ? '/api/v1'
  : import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends and receives HTTP-only cookies
  headers: {
    Accept: 'application/json',
  },
  timeout: 30000, // 30s timeout for resume processing
});

// Response interceptor for beginner-friendly error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Backend returned an error response status
      message = error.response.data?.message || error.response.data?.error || `Request failed with status ${error.response.status}`;
    } else if (error.code === 'ERR_NETWORK') {
      message = `Cannot connect to CareerFit API backend at ${API_BASE_URL}. Ensure your Express server is running.`;
    } else if (error.message) {
      message = error.message;
    }

    const apiError = new Error(message);
    apiError.status = error.response?.status;
    apiError.code = error.code;
    return Promise.reject(apiError);
  }
);
