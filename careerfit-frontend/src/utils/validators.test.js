import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateResumeFile,
  validateJobDescription,
  validateEmail,
  validatePassword,
  validateName,
  MAX_FILE_SIZE_BYTES,
} from './validators.js';
import { formatBytes, getScoreTier } from './formatters.js';

test('validateResumeFile rejects missing file', () => {
  const result = validateResumeFile(null);
  assert.equal(result.isValid, false);
});

test('validateResumeFile flags legacy .doc with conversion guidance', () => {
  const result = validateResumeFile({ name: 'my_resume.doc', size: 1024 * 100 });
  assert.equal(result.isValid, false);
  assert.equal(result.isLegacyDoc, true);
  assert.match(result.error || '', /Legacy \.doc files are not supported/);
});

test('validateResumeFile accepts valid .pdf and .docx files', () => {
  const pdfResult = validateResumeFile({ name: 'john_doe_resume.pdf', size: 1024 * 500 });
  assert.equal(pdfResult.isValid, true);

  const docxResult = validateResumeFile({ name: 'jane_resume.docx', size: 1024 * 800 });
  assert.equal(docxResult.isValid, true);
});

test('validateResumeFile rejects invalid extensions like .png or .txt', () => {
  const pngResult = validateResumeFile({ name: 'screenshot.png', size: 1024 * 500 });
  assert.equal(pngResult.isValid, false);

  const txtResult = validateResumeFile({ name: 'notes.txt', size: 1024 * 50 });
  assert.equal(txtResult.isValid, false);
});

test('validateResumeFile rejects files exceeding 5MB', () => {
  const bigFile = { name: 'huge_portfolio.pdf', size: MAX_FILE_SIZE_BYTES + 1024 };
  const result = validateResumeFile(bigFile);
  assert.equal(result.isValid, false);
  assert.match(result.error || '', /5 MB limit/);
});

test('validateResumeFile rejects empty 0-byte files', () => {
  const emptyFile = { name: 'empty.pdf', size: 0 };
  const result = validateResumeFile(emptyFile);
  assert.equal(result.isValid, false);
});

test('validateJobDescription validates non-empty and minimum length', () => {
  assert.equal(validateJobDescription('').isValid, false);
  assert.equal(validateJobDescription('   ').isValid, false);
  assert.equal(validateJobDescription('Short job').isValid, false);
  assert.equal(
    validateJobDescription('We are seeking an experienced full-stack engineer proficient in React, Node, and TypeScript to architect scalable services.').isValid,
    true
  );
});

test('validateEmail checks standard email syntax', () => {
  assert.equal(validateEmail('').isValid, false);
  assert.equal(validateEmail('notanemail').isValid, false);
  assert.equal(validateEmail('user@domain.com').isValid, true);
});

test('validatePassword requires at least 6 characters', () => {
  assert.equal(validatePassword('12345').isValid, false);
  assert.equal(validatePassword('123456').isValid, true);
});

test('validateName validates full name input', () => {
  assert.equal(validateName('').isValid, false);
  assert.equal(validateName('A').isValid, false);
  assert.equal(validateName('Alex Rivera').isValid, true);
});

test('formatters test formatBytes and getScoreTier', () => {
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024 * 2.5), '2.5 MB');

  const tier85 = getScoreTier(85);
  assert.equal(tier85.label, 'Strong Compatibility');

  const tier65 = getScoreTier(65);
  assert.equal(tier65.label, 'Moderate Alignment');

  const tier35 = getScoreTier(35);
  assert.equal(tier35.label, 'Low Alignment');
});
