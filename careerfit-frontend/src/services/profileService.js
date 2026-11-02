/**
 * Profile service for retrieving and updating user details
 * Plain JavaScript (ES6+) implementation connecting to Express MERN API
 */
import { apiClient } from './api.js';

export const profileService = {
  /**
   * Retrieve current user profile
   * @returns {Promise<object>}
   */
  async getProfile() {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },

  async updateProfile(profile) {
    const response = await apiClient.put('/auth/me', profile);
    return response.data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.put('/auth/me/avatar', formData, {
      timeout: 60000,
    });
    return response.data;
  },

  async removeAvatar() {
    const response = await apiClient.delete('/auth/me/avatar');
    return response.data;
  },
};
