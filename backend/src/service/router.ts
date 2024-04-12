import {
  errorHandler,
  loadBackendConfig,
  HostDiscovery,
} from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { BlamelessJob } from './cron-job';
import { CatalogClient } from '@backstage/catalog-client';


export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const config = await loadBackendConfig({
    argv: process.argv,
    logger: logger,
  });

  const router = Router();
  router.use(express.json());

  
  if (
    config.has('blameless')
    && config.has('blameless.baseUrl')
    && config.has('blameless.authKey')
    ) {
    // Start the cron job only if the config is provided
    const catalogApi = new CatalogClient({
      discoveryApi: HostDiscovery.fromConfig(config),
    });
    const blamelessJob =new BlamelessJob({
      config, logger: logger,
      discovery: HostDiscovery.fromConfig(config),
      catalogClient: catalogApi
    });
    await blamelessJob.start();
    // add router for blameless incidents
    router.get('/incidents', async (req, response) => {
      const page = Number(req.query.page) || 0;
      const limit = Number(req.query.limit) || 100;
      const search = req.query.search as string;
      try {
        const incidents = await blamelessJob.blamelessService.getIncidents(search, page, limit);
        response.json(incidents);
      } catch (error) {
        logger.error('Failed to get incidents', error);
        response.status(500).json({error: error || 'Failed to get incidents'});
      }
    });
  } else {
    logger.info('Missing config values, Blameless cron job is not started');
    // hamdle missing config values
    router.get('/incidents', async (_, response) => {
      response.status(500).json({error: 'missing blameless config values, Make sure to provide blameless.baseUrl and blameless.authKey in the config file'});
    });
  }

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(errorHandler());
  return router;
}
