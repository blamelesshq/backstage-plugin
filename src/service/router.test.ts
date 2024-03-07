import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';

// mock HostDiscovery
jest.mock('@backstage/backend-common', () => {
  const originalModule = jest.requireActual('@backstage/backend-common');
  return {
    ...originalModule,
    HostDiscovery: {
      fromConfig: jest.fn().mockReturnValue({
        getBaseUrl: jest.fn().mockReturnValue('mock-base-url'),
      }),
    },
  };
});

// mock BlamelessJob
jest.mock('./cron-job', () => {
  return {
    BlamelessJob: jest.fn().mockImplementation(() => {
      return {
        start: jest.fn(),
      };
    }),
  };
});


describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /blameless/health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/blameless/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
