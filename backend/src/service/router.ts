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
import { DiscoveryService, RootConfigService } from '@backstage/backend-plugin-api';
import { FetchApi } from '@backstage/core-plugin-api';


export interface RouterOptions {
  logger: Logger;
  discovery?: DiscoveryService;
  catalogClient?: CatalogClient;
  fetchApi?: FetchApi;
  permissions?: string[];
  config?: RootConfigService;
  auth?: any;
  httpAuth?: any;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, fetchApi } = options;

  const config = await loadBackendConfig({
    argv: process.argv,
    logger: logger,
  });

  const router = Router();
  router.use(express.json());

  
  if (config.has('blameless')) {
    // Start the cron job only if the config is provided
    const catalogApi = new CatalogClient({
      discoveryApi: HostDiscovery.fromConfig(config),
      fetchApi: fetchApi,
    });
    const blamelessJob =new BlamelessJob({config, logger: logger, discovery: HostDiscovery.fromConfig(config), catalogClient: catalogApi});
    await blamelessJob.start();
    // add router for blameless incidents
    router.get('/incidents', async (_, response) => {
      const incidents = await blamelessJob.blamelessService.getIncidents();
      response.json(incidents);
    });
  } else {
    logger.info('Missing config values, Blameless cron job is not started');
  }

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(errorHandler());
  return router;
}
