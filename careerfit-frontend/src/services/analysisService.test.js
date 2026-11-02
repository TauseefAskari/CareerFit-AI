import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from './api.js';
import { analysisService } from './analysisService.js';

async function withApiAdapter(adapter, run) {
  const originalAdapter = apiClient.defaults.adapter;
  apiClient.defaults.adapter = adapter;
  try {
    await run();
  } finally {
    apiClient.defaults.adapter = originalAdapter;
  }
}

function createResponse(config, data, status = 200) {
  return {
    config,
    data,
    headers: {},
    status,
    statusText: 'OK',
  };
}

function getRequestPath(config) {
  const basePath = config.baseURL?.startsWith('http')
    ? new URL(config.baseURL).pathname
    : config.baseURL || '';
  return `${basePath.replace(/\/+$/, '')}/${config.url.replace(/^\/+/, '')}`;
}

test('getHistory reads and normalizes the authenticated analyses response', async () => {
  await withApiAdapter(async (config) => {
    assert.equal(getRequestPath(config), '/api/v1/analysis');
    return createResponse(config, {
      count: 1,
      analyses: [{
        _id: 'analysis-1',
        matchScore: 82,
        matchedSkills: ['React'],
        fileName: 'resume.pdf',
      }],
    });
  }, async () => {
    const history = await analysisService.getHistory();
    assert.equal(history.length, 1);
    assert.equal(history[0].id, 'analysis-1');
    assert.equal(history[0].matchScore, 82);
    assert.equal(history[0].resumeFileName, 'resume.pdf');
  });
});

test('getHistory reports an invalid API response instead of returning empty history', async () => {
  await withApiAdapter(async (config) => createResponse(config, { count: 2 }), async () => {
    await assert.rejects(analysisService.getHistory(), /invalid response/i);
  });
});

test('dashboard statistics are derived from the authenticated history endpoint', async () => {
  await withApiAdapter(async (config) => {
    assert.equal(getRequestPath(config), '/api/v1/analysis');
    return createResponse(config, {
      count: 2,
      analyses: [
        { _id: 'analysis-2', matchScore: 90 },
        { _id: 'analysis-1', matchScore: 70 },
      ],
    });
  }, async () => {
    const stats = await analysisService.getDashboardStats();
    assert.equal(stats.totalAnalyses, 2);
    assert.equal(stats.averageMatchScore, 80);
    assert.equal(stats.latestAnalysis.id, 'analysis-2');
    assert.deepEqual(stats.recentAnalyses.map(({ id }) => id), ['analysis-2', 'analysis-1']);
  });
});

test('getAnalysisById unwraps the backend analysis response', async () => {
  await withApiAdapter(async (config) => {
    assert.equal(getRequestPath(config), '/api/v1/analysis/analysis-1');
    return createResponse(config, {
      analysis: { _id: 'analysis-1', matchScore: 76 },
    });
  }, async () => {
    const analysis = await analysisService.getAnalysisById('analysis-1');
    assert.equal(analysis.id, 'analysis-1');
    assert.equal(analysis.matchScore, 76);
  });
});

test('resume submission uses extraction then JSON analysis endpoints', async () => {
  const requests = [];
  await withApiAdapter(async (config) => {
    requests.push(config);
    if (getRequestPath(config) === '/api/v1/resumes/upload') {
      return createResponse(config, {
        fileName: 'resume.pdf',
        resumeText: 'Extracted resume text',
      });
    }

    return createResponse(config, {
      analysis: { id: 'analysis-1', matchScore: 88, resumeFileName: 'resume.pdf' },
    }, 201);
  }, async () => {
    const file = Object.assign(new Blob(['resume']), { name: 'my-resume.pdf' });
    const upload = await analysisService.uploadResume(file);
    const analysis = await analysisService.analyzeResume(upload.resumeText, 'Role description', upload.fileName);

    assert.equal(upload.resumeText, 'Extracted resume text');
    assert.equal(analysis.id, 'analysis-1');
    assert.equal(analysis.resumeFileName, 'resume.pdf');
    assert.equal(getRequestPath(requests[0]), '/api/v1/resumes/upload');
    assert.equal(requests[0].data.get('resume') instanceof Blob, true);
    assert.equal(getRequestPath(requests[1]), '/api/v1/analysis');
    assert.deepEqual(JSON.parse(requests[1].data), {
      resumeText: 'Extracted resume text',
      jobDescription: 'Role description',
      resumeFileName: 'resume.pdf',
    });
  });

  test('resume upload falls back to the selected file name when the API omits it', async () => {
    await withApiAdapter(async (config) => createResponse(config, {
      resumeText: 'Extracted resume text',
    }), async () => {
      const file = Object.assign(new Blob(['resume']), { name: 'my-resume.pdf' });
      const upload = await analysisService.uploadResume(file);
      assert.equal(upload.fileName, 'my-resume.pdf');
    });
  });
});
