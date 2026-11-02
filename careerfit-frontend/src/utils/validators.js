/**
 * Resume and input validation utilities for CareerFit AI
 * Plain JavaScript (ES6+) implementation
 */

// Maximum file size in bytes: 5 MB (5 * 1024 * 1024)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Allowed file extensions for resumes
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];

/**
 * Validates a resume file for supported format (.pdf, .docx) and size (<= 5MB).
 * Specifically detects legacy .doc files and guides user to convert to .docx or .pdf.
 *
 * @param {File|{name: string, size: number}} file - The file object to validate
 * @returns {{isValid: boolean, error?: string, isLegacyDoc?: boolean}}
 */
export function validateResumeFile(file) {
  if (!file) {
    return { isValid: false, error: 'Please select a resume file to upload.' };
  }

  const fileName = (file.name || '').trim();
  const lowerName = fileName.toLowerCase();

  // Explicit check for legacy .doc format
  if (lowerName.endsWith('.doc')) {
    return {
      isValid: false,
      isLegacyDoc: true,
      error: 'Legacy .doc files are not supported. Please open your document and save/export as .docx or PDF.',
    };
  }

  // Check supported extensions (.pdf, .docx)
  const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  if (!hasValidExt) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload a .pdf or .docx document.',
    };
  }

  // Check 5 MB size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size exceeds the 5 MB limit (Current: ${sizeInMB} MB). Please compress or reduce your resume file.`,
    };
  }

  // Prevent empty 0-byte files
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected file is empty. Please upload a valid resume.',
    };
  }

  return { isValid: true };
}

/**
 * Validates target job description text
 *
 * @param {string} text - Job description content
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateJobDescription(text) {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'Job description is required. Please paste the job requirements.' };
  }

  const trimmed = text.trim();
  if (trimmed.length < 50) {
    return {
      isValid: false,
      error: `Job description is too brief (${trimmed.length} chars). For meaningful analysis, provide at least 50 characters.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates standard email address syntax
 *
 * @param {string} email
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

/**
 * Validates password length (at least 6 characters)
 *
 * @param {string} password
 * @returns {{isValid: boolean, error?: string}}
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters.' };
  }
  return { isValid: true };
}

/**
 * Validates user full name
 *
 * @param {string} name
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Full name is required.' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  return { isValid: true };
}
