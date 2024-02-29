import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

jest.mock('@backstage/config', () => {
  return {
    loadConfig: jest.fn().mockResolvedValue({}),
  };
});

jest.mock('@backstage/backend-common', () => {
  return {
    ...jest.requireActual('@backstage/backend-common'),
    PluginEndpointDiscovery: {
      fromConfig: jest.fn().mockResolvedValue({
        getBaseUrl: () => 'http://localhost:7000',
      }),
    },
  };
});

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: {} as any,
      discovery: {} as any,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
