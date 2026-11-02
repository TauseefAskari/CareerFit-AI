import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from './api.js';
import { profileService } from './profileService.js';

async function withApiAdapter(adapter, run) {
  const originalAdapter = apiClient.defaults.adapter;
  apiClient.defaults.adapter = adapter;
  try {
    await run();
  } finally {
    apiClient.defaults.adapter = originalAdapter;
  }
}

function createResponse(config, data) {
  return { config, data, headers: {}, status: 200, statusText: 'OK' };
}

test('updateProfile submits the editable name without changing email', async () => {
  await withApiAdapter(async (config) => {
    assert.equal(config.url, '/auth/me');
    assert.equal(config.method, 'put');
    assert.deepEqual(JSON.parse(config.data), { name: 'Updated Name' });
    return createResponse(config, { user: { name: 'Updated Name', email: 'account@example.com' } });
  }, async () => {
    const result = await profileService.updateProfile({ name: 'Updated Name' });
    assert.equal(result.user.email, 'account@example.com');
  });
});

test('uploadAvatar sends a multipart image to the protected profile endpoint', async () => {
  await withApiAdapter(async (config) => {
    assert.equal(config.url, '/auth/me/avatar');
    assert.equal(config.method, 'put');
    assert.equal(config.data.get('avatar').name, 'avatar.webp');
    return createResponse(config, { user: { avatarUrl: 'https://images.example/avatar.webp' } });
  }, async () => {
    const image = new File(['image'], 'avatar.webp', { type: 'image/webp' });
    const result = await profileService.uploadAvatar(image);
    assert.equal(result.user.avatarUrl, 'https://images.example/avatar.webp');
  });
});
