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
  const mocked_incidents = [
    {
      id: '1',
      title: 'mock-title',
      status: 'mock-status',
      severity: 'mock-severity',
      incident_type: 'mock-incident-type',
      created: 'mock-created',
      postmortem_url: 'mock-postmortem-url',
      incident_url: 'mock-incident-url',
    },
  ]
  return {
    BlamelessJob: jest.fn().mockImplementation(() => {
      return {
        start: jest.fn(),
        blamelessService: {
          getIncidents: jest.fn().mockResolvedValue(mocked_incidents),
        },
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

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
  describe('GET /incidents', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/incidents');

      expect(response.status).toEqual(200);
    });
  });
});
