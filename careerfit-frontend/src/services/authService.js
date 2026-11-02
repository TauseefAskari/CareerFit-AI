/**
 * Authentication service handling login, registration, and session
 * Plain JavaScript (ES6+) implementation connecting to Express MERN API
 */
import { apiClient } from './api.js';

export const authService = {
  /**
   * Log in user with email & password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user: object}>}
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register a new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user: object}>}
   */
  async register(name, email, password) {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Retrieve current authenticated user using HTTP-only cookie
   * @returns {Promise<{user: object|null}>}
   */
  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Log out user
   * @returns {Promise<void>}
   */
  async logout() {
    await apiClient.post('/auth/logout');
  },
};
